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

let cachedKeys: { imgKey: string; subKey: string } | null = null;

async function md5(input: string): Promise<string> {
	const encoder = new TextEncoder();
	const data = encoder.encode(input);
	const hash = await crypto.subtle.digest("MD5", data);
	const hex = Array.from(new Uint8Array(hash))
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
	return hex;
}

async function getWbiKeys(): Promise<{ imgKey: string; subKey: string }> {
	if (cachedKeys) return cachedKeys;

	try {
		const res = await fetch("https://api.bilibili.com/x/web-interface/nav", {
			headers: BASE_HEADERS,
			credentials: "include",
		});
		const json = await res.json();
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

function getMixinKey(raw: string): string {
	let result = "";
	for (let i = 0; i < 32; i++) {
		result += raw[mixinKeyEncTab[i]];
	}
	return result;
}

function sanitizeValue(value: string): string {
	return value.replace(/[!'()*]/g, "");
}

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

	const sortedKeys = Object.keys(allParams).sort();
	const query = sortedKeys.map((k) => `${k}=${allParams[k]}`).join("&");
	const wRid = await md5(query + mixinKey);

	return `${query}&w_rid=${wRid}`;
}

export async function fetchJson<T = unknown>(url: string): Promise<T> {
	const res = await fetch(url, {
		headers: BASE_HEADERS,
		credentials: "include",
	});
	const text = await res.text();
	try {
		return JSON.parse(text) as T;
	} catch {
		throw new Error(`Expected JSON but got HTML (length=${text.length}): ${text.substring(0, 100)}`);
	}
}