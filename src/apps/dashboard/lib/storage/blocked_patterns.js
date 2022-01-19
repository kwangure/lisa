import { derived } from "svelte/store";
import { persistable } from "storables";

const default_blocked_urls = [
    {
        name: "Gmail",
        patterns: ["*://mail.google.com/*"],
        block_during: {
            focus: true,
            break: false,
        },
        blocked_history: [],
        ignored_history: [],
    },
    {
        name: "WhatsApp",
        patterns: ["*://web.whatsapp.com/*"],
        block_during: {
            focus: true,
            break: false,
        },
        blocked_history: [],
        ignored_history: [],
    },
    {
        name: "YouTube",
        patterns: ["*://*.youtube.com/*"],
        block_during: {
            focus: true,
            break: false,
        },
        blocked_history: [],
        ignored_history: [],
    },
    {
        name: "Twitter",
        patterns: ["*://twitter.com/*"],
        block_during: {
            focus: true,
            break: false,
        },
        blocked_history: [],
        ignored_history: [],
    },
];


const STORE_NAME = "lisaBlocked";

const blocked_urls_store = persistable({
    name: STORE_NAME,
    io: {
        read({ set }) {
            chrome.storage.local.get(STORE_NAME, (storage) => {
                if (Object.hasOwnProperty.call(storage, STORE_NAME)) {
                    set(storage[STORE_NAME]);
                } else {
                    chrome.storage.local.set({
                        [STORE_NAME]: default_blocked_urls,
                    });
                }
            });

            function setStorageValue(storage) {
                console.log("storage changed", { storage });
                if (storage[STORE_NAME]?.newValue) {
                    set(storage[STORE_NAME].newValue);
                }
            }

            chrome.storage.onChanged.addListener(setStorageValue);

            return () => {
                chrome.storage.onChanged.removeListener(setStorageValue);
            };
        },
        write(value, { set }) {
            chrome.storage.local.set({ [STORE_NAME]: value }, () => {
                set(value);
            });
        },
    },
});

export const patterns = derived(
    blocked_urls_store[STORE_NAME],
    ($blocked_store) => $blocked_store
        ?.map(({ patterns }) => patterns)
        .flat() || []
);
