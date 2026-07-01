import crypto from "node:crypto";

// WBI 签名打乱表（来自 B 站官方 JS）
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

// Fallback wbi keys（从 nav 接口获取的最新值，会不定期更新）
const FALLBACK_KEYS = {
	imgKey: "7cd084941338484aae1ad9425b84077c",
	subKey: "4932caff0ff746eab6f01bf08b70ac45",
};

// 缓存
let cachedKeys: { imgKey: string; subKey: string } | null = null;
let cachedBuvid: { buvid3: string; buvid4: string } | null = null;

/** 从环境变量获取 SESSDATA（用户需在构建环境中设置） */
function getSessdata(): string {
	return process.env.BILIBILI_SESSDATA || "";
}

/** 获取 buvid3/buvid4（不需要登录） */
async function getBuvid(): Promise<{ buvid3: string; buvid4: string }> {
	if (cachedBuvid) return cachedBuvid;
	try {
		const res = await fetch("https://api.bilibili.com/x/frontend/finger/spi", {
			headers: BASE_HEADERS,
		});
		const json = await res.json();
		cachedBuvid = {
			buvid3: json.data?.b_3 || "",
			buvid4: json.data?.b_4 || "",
		};
		return cachedBuvid;
	} catch {
		return { buvid3: "", buvid4: "" };
	}
}

/** 构建完整的 Cookie 字符串 */
async function buildCookie(): Promise<string> {
	const sessdata = getSessdata();
	const { buvid3, buvid4 } = await getBuvid();
	const parts: string[] = [];
	if (buvid3) parts.push(`buvid3=${buvid3}`);
	if (buvid4) parts.push(`buvid4=${buvid4}`);
	if (sessdata) parts.push(`SESSDATA=${sessdata}`);
	return parts.join("; ");
}

/** 获取带 Cookie 的完整请求头 */
async function getHeaders(): Promise<Record<string, string>> {
	const cookie = await buildCookie();
	return { ...BASE_HEADERS, ...(cookie ? { Cookie: cookie } : {}) };
}

/** 从 nav 接口获取 img_key 和 sub_key，失败时使用 fallback */
async function getWbiKeys(): Promise<{ imgKey: string; subKey: string }> {
	if (cachedKeys) return cachedKeys;

	try {
		const headers = await getHeaders();
		const res = await fetch("https://api.bilibili.com/x/web-interface/nav", {
			headers,
		});
		const text = await res.text();
		const json = JSON.parse(text);
		const imgUrl: string = json.data?.wbi_img?.img_url || "";
		const subUrl: string = json.data?.wbi_img?.sub_url || "";
		const imgKey = imgUrl.slice(imgUrl.lastIndexOf("/") + 1, imgUrl.lastIndexOf("."));
		const subKey = subUrl.slice(subUrl.lastIndexOf("/") + 1, subUrl.lastIndexOf("."));
		if (imgKey && subKey) {
			cachedKeys = { imgKey, subKey };
			return cachedKeys;
		}
		throw new Error("Empty wbi keys");
	} catch (e) {
		console.warn("[WBI] Failed to get keys from nav, using fallback:", e instanceof Error ? e.message : e);
		cachedKeys = FALLBACK_KEYS;
		return cachedKeys;
	}
}

/** 用打乱表从 raw 中提取 32 位 mixin_key */
function getMixinKey(raw: string): string {
	let result = "";
	for (let i = 0; i < 32; i++) {
		result += raw[mixinKeyEncTab[i]];
	}
	return result;
}

/** 过滤参数值中的特殊字符（B 站要求） */
function sanitizeValue(value: string): string {
	return value.replace(/[!'()*]/g, "");
}

/**
 * 对参数进行 WBI 签名，返回带 wts 和 w_rid 的完整查询字符串
 */
export async function wbiSignedQuery(
	params: Record<string, string | number>,
): Promise<string> {
	const { imgKey, subKey } = await getWbiKeys();
	const mixinKey = getMixinKey(imgKey + subKey);

	const allParams: Record<string, string> = {
		...Object.fromEntries(
			Object.entries(params).map(([k, v]) => [k, sanitizeValue(String(v))]),
		),
		wts: Math.floor(Date.now() / 1000).toString(),
	};

	// 按 key 字典序排序
	const sortedKeys = Object.keys(allParams).sort();
	const query = sortedKeys.map((k) => `${k}=${allParams[k]}`).join("&");
	const wRid = crypto.createHash("md5").update(query + mixinKey).digest("hex");

	return `${query}&w_rid=${wRid}`;
}

/** 检查是否配置了 SESSDATA */
export function hasSessdata(): boolean {
	return !!getSessdata();
}

/**
 * 安全的 JSON fetch：自动带 Cookie，检查响应是否为 JSON
 */
export async function fetchJson<T = unknown>(url: string): Promise<T> {
	const headers = await getHeaders();
	const res = await fetch(url, { headers });
	const text = await res.text();
	try {
		return JSON.parse(text) as T;
	} catch {
		throw new Error(`Expected JSON but got HTML (length=${text.length}): ${text.substring(0, 100)}`);
	}
}
