// ==UserScript==
// @name         Reddit Image Proxy
// @version      1.0.0
// @author       thea
// @description  Redirect Reddit's image viewer to a proxy.
// @icon         https://www.reddit.com/favicon.ico
// @license      AGPL-3.0-or-later
// @namespace    thea.pet
// @run-at       document-start
// @match        https://*.reddit.com/media?*
// ==/UserScript==

const proxy = new URL("https://rip.thea.pet");

function replaceContent() {
	window.stop();

	const searchParams = new URLSearchParams(window.location.search);
	const urlParam = searchParams.get("url");

	const imageUrl = new URL(urlParam);
	window.location.replace(`${proxy.origin}${imageUrl.pathname}`);
}

if (window.location.pathname === "/media") {
	replaceContent();
}
