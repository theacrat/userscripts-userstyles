// ==UserScript==
// @name         Reddit Open in Apollo
// @version      1.0.0
// @author       thea
// @description  Open Reddit links in Apollo.
// @icon         https://www.reddit.com/favicon.ico
// @inject-into  content
// @license      AGPL-3.0-or-later
// @namespace    thea.pet
// @run-at       document-start
// @match        *://*/*
// ==/UserScript==

const domains = ["reddit.com", "redditmedia.com"];
const disallowedPaths = [
	"new",
	"best",
	"top",
	"hot",
	"rising",
	"controversial",
	"search",
	"submitted",
	"comments",
];

function getIntent(href) {
	if (!href) {
		return;
	}

	const url = new URL(href);

	if (!domains.includes(url.hostname.split(".").slice(-2).join("."))) {
		return;
	}

	const splitPath = url.pathname.split("/");
	const filtered = splitPath.filter((p, i) => {
		if (!p) {
			return false;
		}

		if (splitPath[1] === "r" && splitPath[3] === "comments") {
			return true;
		}

		if (i > 1 && disallowedPaths.includes(p)) {
			return false;
		}

		return true;
	});

	return `reddit.com/${filtered.join("/")}`;
}

function openInApp(href) {
	const intent = getIntent(href);
	if (intent) {
		window.location.assign(`apollo://${intent}`);
		return true;
	}
}

document.addEventListener("click", (e) => {
	if (openInApp(e.target.closest("a")?.href)) {
		e.preventDefault();
		e.stopPropagation();
	}
});

openInApp(window.location.href);
