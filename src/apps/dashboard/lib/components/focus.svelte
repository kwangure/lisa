<script>
    import { matchPattern } from "browser-extension-url-match";
    import { navigate } from "../chrome.js";
    import { onDestroy } from "svelte";
    import { patterns } from "$lib/storage/blocked_patterns.js";

    $: matchers = $patterns.map(matchPattern);

    function block(tab_id, _, tab) {
        const { url } = tab;
        const { searchParams } = new URL(url);
        if (searchParams.has("lisa-ignore")) return;

        for (const pattern of matchers) {
            if (pattern.match(url)) {
                navigate(tab_id, `/dashboard/index.html?url=${encodeURIComponent(url)}#!/blocked`);
                break;
            }
        }
    }

    $: if ($patterns.length) {
        chrome.tabs.query({ url: $patterns }, (blocked_tabs) => {
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