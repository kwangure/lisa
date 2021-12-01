<script>
    import { matchPattern } from "browser-extension-url-match";
    import { navigate } from "../chrome.js";
    import { onDestroy } from "svelte";

    const blocked_urls = [
        "*://mail.google.com/*",
        "*://web.whatsapp.com/*",
        "*://*.youtube.com/*",
        "*://twitter.com/*",
    ];
    const matchers = blocked_urls.map(matchPattern);

    function block(tab_id, _, tab) {
        for (const pattern of matchers) {
            if (pattern.match(tab.url)) {
                navigate(tab_id, `/dashboard/index.html?url=${tab.url}#!/blocked`);
                break;
            }
        }
    }

    chrome.tabs.query({ url: blocked_urls }, (blocked_tabs) => {
        for (const { id: tab_id, url } of blocked_tabs) {
            navigate(tab_id, `/dashboard/index.html?url=${url}#!/blocked`);
        }
    });

    chrome.tabs.onUpdated.addListener(block);

    onDestroy(() => {
        chrome.tabs.onUpdated.removeListener(block);
    });
</script>