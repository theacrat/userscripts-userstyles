// ==UserScript==
// @name         Reddit Image Proxy
// @version      1.1.0
// @author       thea
// @description  Redirect Reddit's image viewer to a proxy.
// @icon         https://www.reddit.com/favicon.ico
// @license      AGPL-3.0-or-later
// @namespace    thea.pet
// @run-at       document-start
// @match        https://*.reddit.com/media?*
// ==/UserScript==

const proxy = new URL("https://external-content.duckduckgo.com/iu/");

const replaceContent = () => {
	globalThis.stop();

	const searchParams = new URLSearchParams(globalThis.location.search);
	const urlParam = searchParams.get("url");

	const imageUrl = new URL(urlParam);
	proxy.searchParams.set("u", imageUrl.href);
	globalThis.location.replace(proxy.href);
};

if (globalThis.location.pathname === "/media") {
	replaceContent();
}
