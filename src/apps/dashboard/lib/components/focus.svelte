<script>
    import { blocked_urls_store } from "$lib/storage/blocked_patterns.js";
    import isAfter from "date-fns/isAfter";
    import isBefore from "date-fns/isBefore";
    import { matchPattern } from "browser-extension-url-match";
    import { navigate } from "../chrome.js";
    import { onDestroy } from "svelte";

    export let start;
    export let end;

    const { lisaBlocked } = blocked_urls_store;
    let patterns = new Map();

    $: updatePatterns($lisaBlocked);

    function updatePatterns(store) {
        patterns = new Map(store
            .map((blocked_store) => {
                const { name, patterns, ignored_history } = blocked_store;
                const last_history_entry
            = ignored_history.length
            && new Date(ignored_history[ignored_history.length - 1]);

                if (
                    last_history_entry
            && isAfter(last_history_entry, start)
            && isBefore(last_history_entry, end)
                ) {
                    return [];
                }

                return patterns
                    .map((pattern) => ([
                        pattern,
                        {
                            name,
                            matcher: matchPattern(pattern),
                        },
                    ]));
            })
            .flat());
    }

    function block(tab_id, _, tab) {
        const { url } = tab;
        const { searchParams } = new URL(url);
        if (searchParams.has("lisa-ignore")) return;

        for (const { name, matcher } of patterns.values()) {
            if (matcher.match(url)) {
                navigate(tab_id, `/dashboard/index.html?url=${encodeURIComponent(url)}&name=${encodeURIComponent(name)}#!/blocked`);
                break;
            }
        }
    }

    $: if (patterns.size) {
        chrome.tabs.query({ url: Array.from(patterns.keys()) }, (blocked_tabs) => {
            for (const { id: tab_id, url } of blocked_tabs) {
                const { searchParams } = new URL(url);
                if (searchParams.has("lisa-ignore")) return;
                navigate(tab_id, `/dashboard/index.html?url=${encodeURIComponent(url)}#!/blocked`);
            }
        });
    }

    chrome.tabs.onUpdated.addListener(block);

    onDestroy(() => {
        chrome.tabs.onUpdated.removeListener(block);
    });
</script>