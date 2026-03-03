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

const TLD_SLICE = -2;
const PATH_LENGTH = 3;
const [PRIMARY_PATH, SECONDARY_PATH, TERNARY_PATH] = [
	...Array.from({ length: PATH_LENGTH }).keys(),
];

const domains = new Set(["reddit.com", "redditmedia.com"]);
const disallowedPaths = new Set([
	"new",
	"best",
	"top",
	"hot",
	"rising",
	"controversial",
	"search",
	"submitted",
	"comments",
]);

const getIntent = (href) => {
	if (!href) {
		return;
	}

	const url = new URL(href);

	if (!domains.has(url.hostname.split(".").slice(TLD_SLICE).join("."))) {
		return;
	}

	const [, ...splitPath] = globalThis.location.pathname.split("/");
	const filtered = splitPath.filter((path, index) => {
		if (!path) {
			return false;
		}

		if (splitPath[PRIMARY_PATH] === "r" && splitPath[TERNARY_PATH] === "comments") {
			return true;
		}

		if (index > SECONDARY_PATH && disallowedPaths.has(path)) {
			return false;
		}

		return true;
	});

	return `reddit.com/${filtered.join("/")}`;
};

const openInApp = (href) => {
	const intent = getIntent(href);
	if (intent) {
		globalThis.location.assign(`apollo://${intent}`);
		return true;
	}
};

document.addEventListener("click", (event) => {
	if (openInApp(event.target.closest("a")?.href)) {
		event.preventDefault();
		event.stopPropagation();
	}
});

openInApp(globalThis.location.href);
