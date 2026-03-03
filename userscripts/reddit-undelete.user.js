// ==UserScript==
// @name         Reddit Undelete
// @version      1.0.0
// @author       thea
// @description  Adds undelete button to posts and comments on old Reddit.
// @icon         https://www.reddit.com/favicon.ico
// @license      AGPL-3.0-or-later
// @namespace    thea.pet
// @run-at       document-body
// @match        https://*.reddit.com/r/*/comments/*
// ==/UserScript==

const UNDELETE_DOMAIN = "undelete.pullpush.io";
const PROCESSED_CLASS = "undelete-processed";

const undeleteButton = document.createElement("template");
undeleteButton.innerHTML = String.raw`
	<li class="undelete-button">
		<a target="_blank">undelete</a>
	</li>
`;

const processItem = (item) => {
	const buttonList = item.querySelector(".flat-list.buttons");
	const permalink = buttonList.querySelector(".first a");

	const undeleteUrl = new URL(permalink.href);
	undeleteUrl.hostname = UNDELETE_DOMAIN;

	const newButton = undeleteButton.cloneNode(true).content;
	newButton.querySelector("a").href = undeleteUrl;
	buttonList.append(newButton);
	item.classList.add(PROCESSED_CLASS);
};

const undelete = () => {
	const items = document.querySelectorAll(`.thing[data-permalink]:not(.${PROCESSED_CLASS})`);
	for (const item of items) {
		processItem(item);
	}
};

new MutationObserver((_mutationList, self) => {
	cancelAnimationFrame(self.buffer);
	self.buffer = requestAnimationFrame(() => {
		delete self.buffer;
		undelete();
	});
}).observe(document.body, {
	childList: true,
	subtree: true,
});

undelete();
