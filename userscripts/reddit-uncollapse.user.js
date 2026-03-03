// ==UserScript==
// @name         Reddit Uncollapse
// @version      1.0.0
// @author       thea
// @description  Expand auto-collapsed comments on old Reddit.
// @icon         https://www.reddit.com/favicon.ico
// @license      AGPL-3.0-or-later
// @namespace    thea.pet
// @run-at       document-body
// @match        https://*.reddit.com/r/*/comments/*
// ==/UserScript==

const PROCESSED_CLASS = "uncollapse-processed";

const processItem = (item) => {
	item.classList.add(PROCESSED_CLASS);

	if (item.classList.contains("collapsed")) {
		item.querySelector(".tagline .expand").click();
	}
};

const uncollapse = () => {
	const comments = document.querySelectorAll(`.thing.comment:not(.${PROCESSED_CLASS})`);
	for (const item of comments) {
		processItem(item);
	}
};

new MutationObserver((_mutationList, self) => {
	cancelAnimationFrame(self.buffer);
	self.buffer = requestAnimationFrame(() => {
		delete self.buffer;
		uncollapse();
	});
}).observe(document.body, {
	childList: true,
	subtree: true,
});

uncollapse();
