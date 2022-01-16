<script>
    import { page } from "$app/stores";
    import Tooltip from "@kwangure/strawberry/components/Tooltip";

    $: ({ query } = $page);
    $: url = decodeURIComponent(query.get("url"));

    function setURLParam(url, string, value) {
        const temp = new URL(url);
        temp.searchParams.set(string, value);
        return temp.toString();
    }
</script>

<Tooltip>
    <a href="{setURLParam(url, "lisa-ignore", true)}">{url}</a>
    <svelte:fragment slot="popup">
        URL is blocked. Open anyway?
    </svelte:fragment>
</Tooltip> is blocked during focus. Get back to focusing.