// ==UserScript==
// @name         YouTube Open in iOS App
// @version      1.0.0
// @author       thea
// @description  Open YouTube links in the iOS app (allows for tweaked apps).
// @icon         https://www.youtube.com/favicon.ico
// @inject-into  content
// @license      AGPL-3.0-or-later
// @namespace    thea.pet
// @run-at       document-start
// @match        *://*/*
// ==/UserScript==

const domains = ["youtube.com", "youtu.be"];

function getIntent(href) {
	if (!href) {
		return;
	}

	const url = new URL(href);

	if (!domains.includes(url.hostname.split(".").slice(-2).join("."))) {
		return;
	}

	return `${url.hostname}${url.pathname}${url.search}`;
}

function openInApp(href) {
	const intent = getIntent(href);
	if (intent) {
		location.assign(`youtube://${intent}`);
		return true;
	}
}

document.addEventListener("click", (e) => {
	if (openInApp(e.target.closest("a")?.href)) {
		e.preventDefault();
		e.stopPropagation();
	}
});

openInApp(location.href);
