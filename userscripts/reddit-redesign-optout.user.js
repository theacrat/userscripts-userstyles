// ==UserScript==
// @name         Reddit Redesign Optout
// @version      1.0.1
// @author       thea
// @description  Default to old Reddit through the redesign_optout cookie.
// @icon         https://www.reddit.com/favicon.ico
// @license      AGPL-3.0-or-later
// @namespace    thea.pet
// @run-at       document-start
// @grant        none
// @match        https://*.reddit.com/*
// ==/UserScript==

const DOMAIN_SPLIT_SUBDOMAIN = 0;
const DOMAIN_SPLIT_SUBDOMAIN_MAX_LENGTH = 3;

const Cookies = Object.freeze({
	DISABLE: "disable_optout",
	REDESIGN: "redesign_optout",
});

const Domains = Object.freeze({
	ALLOWED_NEW: ["www", "chat", "new", "sh"],
	ALLOWED_OLD: ["www", "chat", "old"],
	COOKIE: "reddit.com",
	WWW: "www.reddit.com",
});

const hasCookie = async (name, value = "true") => {
	const cookie = await cookieStore.get(name);

	if (!cookie) {
		return false;
	}

	return value ? cookie.value === value : true;
};

const setCookie = async (name, value) => {
	await cookieStore.set({
		domain: Domains.COOKIE,
		expires: value ? new Date("9999-12-31T23:59:59.000Z").getTime() : Date.now(),
		name,
		path: "/",
		sameSite: "none",
		value: value ?? "",
	});
};

const redirectToWWW = (allowedDomains) => {
	const subdomain = globalThis.location.host.split(".")[DOMAIN_SPLIT_SUBDOMAIN];
	if (
		!allowedDomains.includes(subdomain) &&
		subdomain.length <= DOMAIN_SPLIT_SUBDOMAIN_MAX_LENGTH
	) {
		globalThis.location = `${globalThis.location.protocol}//${Domains.WWW}${globalThis.location.pathname}`;
		return true;
	}
	return false;
};

globalThis.enableOldRedditCookie = async () => {
	const shouldReload = !(await hasCookie(Cookies.REDESIGN));
	await setCookie(Cookies.DISABLE);
	await setCookie(Cookies.REDESIGN, true);

	if (redirectToWWW(Domains.ALLOWED_NEW)) {
		return;
	}
	if (shouldReload) {
		globalThis.location.reload();
	}
};

globalThis.disableOldRedditCookie = async () => {
	const shouldReload = await hasCookie(Cookies.REDESIGN);
	await setCookie(Cookies.REDESIGN);
	await setCookie(Cookies.DISABLE, true);

	if (redirectToWWW(Domains.ALLOWED_OLD)) {
		return;
	}
	if (shouldReload) {
		globalThis.location.reload();
	}
};

const initialise = async () => {
	if (await hasCookie(Cookies.DISABLE)) {
		globalThis.disableOldRedditCookie();
	} else {
		globalThis.enableOldRedditCookie();
	}
};

initialise();
