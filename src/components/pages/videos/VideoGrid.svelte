<script lang="ts">
import ClientPagination from "@components/common/ClientPagination.svelte";
import { wbiSignedQuery, fetchJson } from "@/utils/bilibili-wbi";
import { Icon } from "astro-icon/components";

export interface BilibiliVideo {
	bvid: string;
	title: string;
	pic: string;
	desc: string;
	play: number;
	danmaku: number;
	created: number;
	length: string;
	typename: string;
}

interface Props {
	uid: string;
	itemsPerPage?: number;
}

let { uid, itemsPerPage = 12 }: Props = $props();

let videos = $state<BilibiliVideo[]>([]);
let totalCount = $state(0);
let loading = $state(true);
let error = $state<string | null>(null);
let loginRequired = $state(false);

let searchQuery = $state("");
let sortBy = $state<"date-desc" | "play-desc">("date-desc");
let currentPage = $state(1);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface RawVlistItem {
	aid: number;
	bvid: string;
	title: string;
	pic: string;
	desc: string;
	play: number;
	video_review: number;
	comment: number;
	created: number;
	length: string;
	typeid: number;
	typename: string;
}

interface ArcSearchResponse {
	code: number;
	message?: string;
	data?: {
		list?: { vlist: RawVlistItem[] };
		page?: { count: number };
	};
}

async function fetchArcSearch(mid: string, pn: number, ps: number): Promise<ArcSearchResponse> {
	const MAX_RETRIES = 3;
	for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
		const query = await wbiSignedQuery({ mid, ps, pn, order: "pubdate" });
		try {
			const json = await fetchJson<ArcSearchResponse>(
				`https://api.bilibili.com/x/space/wbi/arc/search?${query}`,
			);
			return json;
		} catch (e) {
			console.warn(`[Videos] Attempt ${attempt} failed:`, e instanceof Error ? e.message : e);
			if (attempt < MAX_RETRIES) await sleep(2000 * attempt);
		}
	}
	return { code: -1, message: "All retries failed" };
}

async function loadVideos() {
	loading = true;
	error = null;
	loginRequired = false;

	try {
		const ps = 30;
		const json1 = await fetchArcSearch(uid, 1, ps);

		if (json1.code === -352 || json1.code === -101) {
			loginRequired = true;
			loading = false;
			return;
		}

		if (json1.code !== 0 || !json1.data?.list?.vlist) {
			throw new Error(`API returned code ${json1.code}: ${json1.message || ""}`);
		}

		const vlist: RawVlistItem[] = [...json1.data.list.vlist];
		totalCount = json1.data.page?.count || vlist.length;
		const totalPages = Math.ceil(totalCount / ps);

		for (let pn = 2; pn <= totalPages; pn++) {
			await sleep(500);
			const json = await fetchArcSearch(uid, pn, ps);
			if (json.code === 0 && json.data?.list?.vlist) {
				vlist.push(...json.data.list.vlist);
			}
		}

		videos = vlist.map((v) => ({
			bvid: v.bvid,
			title: v.title,
			pic: v.pic || "",
			desc: v.desc || "",
			play: v.play || 0,
			danmaku: v.video_review || 0,
			created: v.created || 0,
			length: v.length || "00:00",
			typename: v.typename || "",
		}));

		console.log(`[Videos] Fetched ${videos.length} videos from Bilibili.`);
	} catch (e) {
		error = e instanceof Error ? e.message : "Unknown error";
		console.error("[Videos] Bilibili fetch error:", e);
	} finally {
		loading = false;
	}
}

$effect(() => {
	loadVideos();
});

let filteredItems = $derived(() => {
	let result = [...videos];
	if (searchQuery.trim()) {
		const q = searchQuery.toLowerCase().trim();
		result = result.filter(
			(v) => v.title.toLowerCase().includes(q) || v.desc.toLowerCase().includes(q),
		);
	}
	if (sortBy === "date-desc") {
		result.sort((a, b) => b.created - a.created);
	} else {
		result.sort((a, b) => b.play - a.play);
	}
	return result;
});

let pagedItems = $derived(() => {
	const start = (currentPage - 1) * itemsPerPage;
	return filteredItems().slice(start, start + itemsPerPage);
});

function resetPage() { currentPage = 1; }

function formatPlay(n: number): string {
	if (n >= 10000) return (n / 10000).toFixed(1) + "万";
	return String(n);
}

function formatDate(ts: number): string {
	const d = new Date(ts * 1000);
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
</script>

<div>
	{#if loading}
		<div class="text-center py-16">
			<div class="inline-flex items-center justify-center w-12 h-12 border-4 border-(--primary)/20 border-t-(--primary) rounded-full animate-spin mb-4"></div>
			<p class="text-neutral-500 dark:text-neutral-400">加载中...</p>
		</div>
	{:else if loginRequired}
		<div class="text-center py-16">
			<div class="inline-flex items-center justify-center w-16 h-16 bg-(--btn-regular-bg) rounded-full mb-6 border border-(--line-divider)">
				<Icon is:inline name="material-symbols:lock" class="text-[2rem] text-(--btn-content)" />
			</div>
			<h2 class="text-xl font-semibold text-black/80 dark:text-white/80 mb-3">
				需要登录 Bilibili
			</h2>
			<p class="text-black/60 dark:text-white/60 mb-4 max-w-lg mx-auto leading-relaxed">
				B 站 API 需要登录态才能获取投稿视频列表。请确保你已在当前浏览器登录 B 站账号，然后刷新页面。
			</p>
			<button
				onclick={loadVideos}
				class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-(--primary) text-white dark:text-black/70 font-medium hover:opacity-80 transition-opacity"
			>
				<Icon is:inline name="material-symbols:refresh" class="text-base" />
				重新加载
			</button>
		</div>
	{:else if error}
		<div class="text-center py-16">
			<div class="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-full mb-6">
				<Icon is:inline name="material-symbols:error" class="text-[2rem] text-red-500" />
			</div>
			<h2 class="text-xl font-semibold text-black/80 dark:text-white/80 mb-3">
				加载失败
			</h2>
			<p class="text-black/60 dark:text-white/60 mb-4 max-w-lg mx-auto">
				{error}
			</p>
			<button
				onclick={loadVideos}
				class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-(--primary) text-white dark:text-black/70 font-medium hover:opacity-80 transition-opacity"
			>
				<Icon is:inline name="material-symbols:refresh" class="text-base" />
				重试
			</button>
		</div>
	{:else}
		<div class="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
			<div class="bg-(--card-bg) rounded-xl p-3 sm:p-4 border border-(--line-divider)">
				<div class="flex items-center gap-2 sm:gap-3">
					<div class="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-(--primary)/10 flex items-center justify-center shrink-0">
						<Icon is:inline name="material-symbols:video-library" class="text-[1rem] sm:text-[1.25rem] text-(--primary)" />
					</div>
					<div class="min-w-0">
						<div class="text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400">投稿总数</div>
						<div class="text-lg sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100">{totalCount}</div>
					</div>
				</div>
			</div>
			<div class="bg-(--card-bg) rounded-xl p-3 sm:p-4 border border-(--line-divider)">
				<div class="flex items-center gap-2 sm:gap-3">
					<div class="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-pink-500/10 flex items-center justify-center shrink-0">
						<Icon is:inline name="material-symbols:play-circle" class="text-[1rem] sm:text-[1.25rem] text-pink-500" />
					</div>
					<div class="min-w-0">
						<div class="text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400">总播放量</div>
						<div class="text-lg sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100">
							{videos.reduce((s, v) => s + v.play, 0) >= 10000
								? (videos.reduce((s, v) => s + v.play, 0) / 10000).toFixed(1) + "万"
								: videos.reduce((s, v) => s + v.play, 0)}
						</div>
					</div>
				</div>
			</div>
			<div class="bg-(--card-bg) rounded-xl p-3 sm:p-4 border border-(--line-divider) col-span-2 lg:col-span-1">
				<div class="flex items-center gap-2 sm:gap-3">
					<div class="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
						<Icon is:inline name="fa7-brands:bilibili" class="text-[1rem] sm:text-[1.25rem] text-blue-500" />
					</div>
					<div class="min-w-0">
						<div class="text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400">数据来源</div>
						<div class="text-lg sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100 truncate">Bilibili</div>
					</div>
				</div>
			</div>
		</div>

		<div class="mb-6 flex flex-col sm:flex-row gap-3">
			<div class="relative flex-1">
				<svg class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				</svg>
				<input
					type="text"
					placeholder="搜索视频..."
					value={searchQuery}
					oninput={(e) => { searchQuery = (e.target as HTMLInputElement).value; resetPage(); }}
					class="w-full rounded-xl border border-(--line-divider) bg-(--card-bg) py-2.5 pl-10 pr-4 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 outline-none transition-colors focus:border-(--primary)"
				/>
			</div>
			<select
				value={sortBy}
				onchange={(e) => { sortBy = (e.target as HTMLSelectElement).value as typeof sortBy; resetPage(); }}
				class="rounded-xl border border-(--line-divider) bg-(--card-bg) px-3 text-sm text-neutral-600 dark:text-neutral-400 outline-none cursor-pointer shrink-0"
			>
				<option value="date-desc">最新发布</option>
				<option value="play-desc">播放最多</option>
			</select>
		</div>

		{#if pagedItems().length > 0}
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{#each pagedItems() as video (video.bvid)}
					<a
						href={`https://www.bilibili.com/video/${video.bvid}`}
						target="_blank"
						rel="noopener noreferrer"
						class="group block rounded-xl overflow-hidden bg-(--card-bg) border border-(--line-divider) transition-all hover:shadow-lg hover:border-(--primary)/30"
					>
						<div class="relative aspect-video overflow-hidden bg-neutral-200 dark:bg-neutral-800">
							<img
								src={video.pic.replace("http://", "https://")}
								alt={video.title}
								loading="lazy"
								referrerpolicy="no-referrer"
								crossorigin="anonymous"
								class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
							/>
							<span class="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/70 text-white text-xs font-medium">
								{video.length}
							</span>
							{#if video.typename}
								<span class="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 text-white text-xs backdrop-blur-sm">
									{video.typename}
								</span>
							{/if}
						</div>
						<div class="p-3">
							<h3 class="text-sm font-medium text-neutral-900 dark:text-neutral-100 line-clamp-2 leading-snug mb-2 group-hover:text-(--primary) transition-colors">
								{video.title}
							</h3>
							<div class="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
								<span class="flex items-center gap-1">
									<svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/></svg>
									{formatPlay(video.play)}
								</span>
								<span class="flex items-center gap-1">
									<svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/></svg>
									{formatPlay(video.danmaku)}
								</span>
								<span>{formatDate(video.created)}</span>
							</div>
						</div>
					</a>
				{/each}
			</div>
		{:else}
			<div class="py-16 text-center">
				<p class="text-neutral-500 dark:text-neutral-400">没有找到相关视频</p>
			</div>
		{/if}

		<ClientPagination
			totalItems={filteredItems().length}
			{itemsPerPage}
			{currentPage}
			onPageChange={(p) => currentPage = p}
		/>
	{/if}
</div>