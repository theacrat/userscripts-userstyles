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

const domains = ["twitter.com", "x.com"];
const disallowedPaths = ["intent", "settings"];

function getIntent(href) {
	if (!href) {
		return;
	}

	const url = new URL(href);

	if (!domains.includes(url.hostname.split(".").slice(-2).join("."))) {
		return;
	}

	const splitPath = url.pathname.split("/");
	const filtered = splitPath.filter((p) => p);

	if (!filtered[0]) {
		filtered[0] = "home";
	}

	if (disallowedPaths.includes(filtered[0])) {
		return;
	}

	if (primaryMap[filtered[0]]) {
		return primaryMap[filtered[0]];
	}

	if (secondaryMap[filtered[1]]) {
		return secondaryMap[filtered[1]];
	}

	switch (filtered[1]) {
		case undefined:
			break;
		case "lists":
			if (!filtered[2]) {
				return;
			}
			return `list?id=${filtered[2]}`;
		case "communities":
			return filtered[2] ? `communities/${filtered[2]}` : "communities";
		case "broadcasts":
		case "spaces":
			return `${filtered[1]}/${filtered[2]}`;
		case "article":
			filtered[1] = "status";
			break;
	}

	if (filtered[0] === "i" && filtered[1] !== "status") {
		return;
	}

	switch (filtered[0]) {
		case "hashtag":
			if (!filtered[1]) {
				break;
			}
			return `hashtag/${filtered[1]}`;
		case "search": {
			const searchQuery = new URLSearchParams(url.search).get("q");
			return searchQuery ? `search?query=${searchQuery}` : "search";
		}
	}

	return filtered[1] === "status"
		? `status?id=${filtered[2]}`
		: `user?screen_name=${filtered[0]}`;
}

function openInApp(href) {
	const intent = getIntent(href);
	if (intent) {
		location.assign(`twitter://${intent}`);
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
