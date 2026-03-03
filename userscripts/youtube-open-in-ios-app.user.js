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

const TLD_SLICE = -2;
const PRIMARY_PATH = 0;

const domains = new Set(["youtube.com", "youtu.be"]);
const disallowedPaths = new Set(["redirect"]);

const getIntent = (href) => {
	if (!href) {
		return;
	}

	const url = new URL(href);

	if (!domains.has(url.hostname.split(".").slice(TLD_SLICE).join("."))) {
		return;
	}

	const [, ...splitPath] = globalThis.location.pathname.split("/");

	if (disallowedPaths.has(splitPath[PRIMARY_PATH])) {
		return;
	}

	return `${url.hostname}${url.pathname}${url.search}`;
};

const openInApp = (href) => {
	const intent = getIntent(href);
	if (intent) {
		location.assign(`youtube://${intent}`);
		return true;
	}
};

document.addEventListener("click", (event) => {
	if (openInApp(event.target.closest("a")?.href)) {
		event.preventDefault();
		event.stopPropagation();
	}
});

openInApp(location.href);
