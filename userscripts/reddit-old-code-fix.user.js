// ==UserScript==
// @name         Reddit Code Fix
// @version      1.0.0
// @author       thea
// @description  Fixes old Reddit code blocks not line-breaking.
// @icon         https://www.reddit.com/favicon.ico
// @license      AGPL-3.0-or-later
// @namespace    thea.pet
// @run-at       document-body
// @match        https://*.reddit.com/r/*/comments/*
// ==/UserScript==

const PROCESSED_CLASS = "code-fix-processed";

const processItem = (item) => {
	if (!item.textContent.includes("\n") || item.closest("pre")) {
		return;
	}

	const pre = document.createElement("pre");
	item.parentElement.insertBefore(pre, item);
	pre.append(item);
	item.textContent = item.textContent.replace("\n", "");

	item.classList.add(PROCESSED_CLASS);
};

const fixCode = () => {
	const items = document.querySelectorAll(`.thing[data-permalink] code:not(.${PROCESSED_CLASS})`);
	for (const item of items) {
		processItem(item);
	}
};

new MutationObserver((_mutationList, self) => {
	cancelAnimationFrame(self.buffer);
	self.buffer = requestAnimationFrame(() => {
		delete self.buffer;
		fixCode();
	});
}).observe(document.body, {
	childList: true,
	subtree: true,
});

fixCode();
