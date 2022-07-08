export function getURL(url) {
	const __dynamic_base__ = window.__dynamic_base__? window.__dynamic_base__ : location.origin
	return new URL(url, __dynamic_base__).href
}
