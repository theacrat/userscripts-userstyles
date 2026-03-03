// ==UserScript==
// @name         X Open in iOS App
// @version      1.0.0
// @author       thea
// @description  Open X/Twitter links in the iOS app (allows for tweaked apps).
// @icon         https://x.com/favicon.ico
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

const primaryMap = Object.freeze({
	home: "timeline",
	messages: "messages",
	notifications: "mentions",
});
const secondaryMap = Object.freeze({
	bookmarks: "bookmarks",
	chat: "chat",
	trends: "trends",
});

const domains = new Set(["twitter.com", "x.com"]);
const disallowedPaths = new Set(["intent", "settings"]);

const normalisePaths = (array) => {
	const modified = [...array];

	if (!modified[PRIMARY_PATH]) {
		modified[PRIMARY_PATH] = "home";
	}

	if (modified[SECONDARY_PATH] === "article") {
		modified[SECONDARY_PATH] = "status";
	}

	return modified;
};

const getPrimaryIntent = (path) => {
	switch (path[SECONDARY_PATH]) {
		case "lists": {
			if (!path[TERNARY_PATH]) {
				break;
			}
			return `list?id=${path[TERNARY_PATH]}`;
		}
		case "communities": {
			return path[TERNARY_PATH] ? `communities/${path[TERNARY_PATH]}` : "communities";
		}
		case "broadcasts":
		case "spaces": {
			return `${path[SECONDARY_PATH]}/${path[TERNARY_PATH]}`;
		}
		default: {
			break;
		}
	}
};

const getIntent = (href) => {
	if (!href) {
		return;
	}

	const url = new URL(href);

	if (!domains.has(url.hostname.split(".").slice(TLD_SLICE).join("."))) {
		return;
	}

	const [, ...splitPath] = globalThis.location.pathname.split("/");
	const normalised = normalisePaths(splitPath);

	if (
		disallowedPaths.has(normalised[PRIMARY_PATH]) ||
		(normalised[PRIMARY_PATH] === "i" && normalised[SECONDARY_PATH] !== "status")
	) {
		return;
	}

	if (primaryMap[normalised[PRIMARY_PATH]]) {
		return primaryMap[normalised[PRIMARY_PATH]];
	}

	if (secondaryMap[normalised[SECONDARY_PATH]]) {
		return secondaryMap[normalised[SECONDARY_PATH]];
	}

	const primaryIntent = getPrimaryIntent(normalised[SECONDARY_PATH]);
	if (primaryIntent) {
		return primaryIntent;
	}

	switch (normalised[PRIMARY_PATH]) {
		case "hashtag": {
			if (!normalised[SECONDARY_PATH]) {
				break;
			}
			return `hashtag/${normalised[SECONDARY_PATH]}`;
		}
		case "search": {
			const searchQuery = new URLSearchParams(url.search).get("q");
			return searchQuery ? `search?query=${searchQuery}` : "search";
		}
		default: {
			break;
		}
	}

	return normalised[SECONDARY_PATH] === "status"
		? `status?id=${normalised[TERNARY_PATH]}`
		: `user?screen_name=${normalised[PRIMARY_PATH]}`;
};

const openInApp = (href) => {
	const intent = getIntent(href);
	if (intent) {
		location.assign(`twitter://${intent}`);
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
