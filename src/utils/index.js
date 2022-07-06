export function getURL(url) {
	return new URL(url, import.meta.url).href
}
