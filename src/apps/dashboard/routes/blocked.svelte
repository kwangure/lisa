<script>
    import { blocked_urls_store } from "$lib/storage/blocked_patterns.js";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import Tooltip from "@kwangure/strawberry/components/Tooltip";

    $: ({ query } = $page);
    $: url = decodeURIComponent(query.get("url"));
    $: name = decodeURIComponent(query.get("name"));

    const { lisaBlocked } = blocked_urls_store;
    function setURLParam(url, string, value) {
        const temp = new URL(url);
        temp.searchParams.set(string, value);
        return temp.toString();
    }

    function handleUnblock() {
        const now = new Date();
        // THIS IS BAD!! We should add some prettier API to the store
        $lisaBlocked
            .find((blocked_url) => blocked_url.name === name)
            .ignored_history.push(now.getTime());
        $lisaBlocked = $lisaBlocked;
        goto(url);
    }
</script>

<Tooltip>
    <a href="{setURLParam(url, "lisa-ignore", true)}"
        on:click|preventDefault={handleUnblock}>{url}</a>
    <svelte:fragment slot="popup">
        URL is blocked. Open anyway?
    </svelte:fragment>
</Tooltip> is blocked during focus. Get back to focusing.