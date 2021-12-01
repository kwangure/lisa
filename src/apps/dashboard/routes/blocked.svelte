<script context="module">
    export function load({ page }) {
        return {
            props: {
                url: page.query.get("url"),
            },
        };
    }
</script>

<script>
    export let url;
</script>

<a href={url}>{url}</a> is blocked during focus. Get back to focusing.