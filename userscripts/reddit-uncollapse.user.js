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

function processItem(i) {
	i.classList.add(PROCESSED_CLASS);

	if (i.classList.contains("collapsed")) {
		i.querySelector(".tagline .expand").click();
	}
}

function uncollapse() {
	const comments = document.querySelectorAll(
		`.thing.comment:not(.${PROCESSED_CLASS})`,
	);

	comments.forEach(processItem);
}

new MutationObserver((_mutationList, self) => {
	const s = self;
	cancelAnimationFrame(s.buffer);
	s.buffer = requestAnimationFrame(() => {
		delete s.buffer;
		uncollapse();
	});
}).observe(document.body, {
	childList: true,
	subtree: true,
});

uncollapse();
