import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUTPUT_PATH = join(ROOT, "public", "data", "bilibili-videos.json");

const mixinKeyEncTab = [
	46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35,
	27, 43, 5, 49, 33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13,
	37, 36, 25, 21, 20, 6, 1, 0, 55, 40, 4, 51, 7, 48, 24, 44,
	54, 30, 11, 16, 22, 2, 57, 9, 34, 26, 52, 59, 17, 55, 14, 41,
];

const BASE_HEADERS = {
	"User-Agent":
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
	Referer: "https://www.bilibili.com/",
	Accept: "application/json, text/plain, */*",
};

const FALLBACK_KEYS = {
	imgKey: "7cd084941338484aae1ad9425b84077c",
	subKey: "4932caff0ff746eab6f01bf08b70ac45",
};

const UID = process.env.BILIBILI_UID || "1741551557";
const SESSDATA = process.env.BILIBILI_SESSDATA || "";

let cachedKeys = null;

function getSessdata() {
	return SESSDATA;
}

async function getBuvid() {
	try {
		const res = await fetch("https://api.bilibili.com/x/frontend/finger/spi", {
			headers: BASE_HEADERS,
		});
		const json = await res.json();
		return {
			buvid3: json.data?.b_3 || "",
			buvid4: json.data?.b_4 || "",
		};
	} catch {
		return { buvid3: "", buvid4: "" };
	}
}

async function buildCookie() {
	const sessdata = getSessdata();
	const { buvid3, buvid4 } = await getBuvid();
	const parts = [];
	if (buvid3) parts.push(`buvid3=${buvid3}`);
	if (buvid4) parts.push(`buvid4=${buvid4}`);
	if (sessdata) parts.push(`SESSDATA=${sessdata}`);
	return parts.join("; ");
}

async function getHeaders() {
	const cookie = await buildCookie();
	return { ...BASE_HEADERS, ...(cookie ? { Cookie: cookie } : {}) };
}

async function getWbiKeys() {
	if (cachedKeys) return cachedKeys;

	try {
		const headers = await getHeaders();
		const res = await fetch("https://api.bilibili.com/x/web-interface/nav", {
			headers,
		});
		const json = await res.json();
		const imgUrl = json.data?.wbi_img?.img_url || "";
		const subUrl = json.data?.wbi_img?.sub_url || "";
		const imgKey = imgUrl.slice(imgUrl.lastIndexOf("/") + 1, imgUrl.lastIndexOf("."));
		const subKey = subUrl.slice(subUrl.lastIndexOf("/") + 1, subUrl.lastIndexOf("."));
		if (imgKey && subKey) {
			cachedKeys = { imgKey, subKey };
			return cachedKeys;
		}
		throw new Error("Empty wbi keys");
	} catch (e) {
		console.warn("[WBI] Failed to get keys, using fallback:", e.message);
		cachedKeys = FALLBACK_KEYS;
		return cachedKeys;
	}
}

function getMixinKey(raw) {
	let result = "";
	for (let i = 0; i < 32; i++) {
		result += raw[mixinKeyEncTab[i]];
	}
	return result;
}

function sanitizeValue(value) {
	return value.replace(/[!'()*]/g, "");
}

async function wbiSignedQuery(params) {
	const { imgKey, subKey } = await getWbiKeys();
	const mixinKey = getMixinKey(imgKey + subKey);

	const allParams = {
		...Object.fromEntries(
			Object.entries(params).map(([k, v]) => [k, sanitizeValue(String(v))]),
		),
		wts: Math.floor(Date.now() / 1000).toString(),
	};

	const sortedKeys = Object.keys(allParams).sort();
	const query = sortedKeys.map((k) => `${k}=${allParams[k]}`).join("&");
	const wRid = crypto.createHash("md5").update(query + mixinKey).digest("hex");

	return `${query}&w_rid=${wRid}`;
}

async function fetchJson(url) {
	const headers = await getHeaders();
	const res = await fetch(url, { headers });
	const text = await res.text();
	try {
		return JSON.parse(text);
	} catch {
		throw new Error(`Expected JSON but got HTML (length=${text.length}): ${text.substring(0, 100)}`);
	}
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchArcSearch(mid, pn, ps) {
	const MAX_RETRIES = 3;
	for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
		const query = await wbiSignedQuery({ mid, ps, pn, order: "pubdate" });
		try {
			const json = await fetchJson(
				`https://api.bilibili.com/x/space/wbi/arc/search?${query}`,
			);
			return json;
		} catch (e) {
			console.warn(`[Videos] Attempt ${attempt} failed:`, e.message);
			if (attempt < MAX_RETRIES) await sleep(2000 * attempt);
		}
	}
	return { code: -1, message: "All retries failed" };
}

async function main() {
	console.log(`Fetching Bilibili videos for UID: ${UID}...`);

	const ps = 30;
	const json1 = await fetchArcSearch(UID, 1, ps);

	if (json1.code !== 0 || !json1.data?.list?.vlist) {
		console.error(`API returned code ${json1.code}: ${json1.message || ""}`);
		process.exit(1);
	}

	const vlist = [...json1.data.list.vlist];
	const totalCount = json1.data.page?.count || vlist.length;
	const totalPages = Math.ceil(totalCount / ps);

	console.log(`Total videos: ${totalCount}, total pages: ${totalPages}`);

	for (let pn = 2; pn <= totalPages; pn++) {
		await sleep(500);
		const json = await fetchArcSearch(UID, pn, ps);
		if (json.code === 0 && json.data?.list?.vlist) {
			vlist.push(...json.data.list.vlist);
			console.log(`Fetched page ${pn}/${totalPages}`);
		}
	}

	const videos = vlist.map((v) => ({
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

	const output = {
		updatedAt: new Date().toISOString(),
		totalCount,
		videos,
	};

	const dir = dirname(OUTPUT_PATH);
	if (!existsSync(dir)) {
		mkdirSync(dir, { recursive: true });
	}

	writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), "utf-8");
	console.log(`Saved ${videos.length} videos to ${OUTPUT_PATH}`);
}

main().catch((e) => {
	console.error("Error:", e);
	process.exit(1);
});