<script context="module">
    import createLisaMachine from "$lib/machines/lisa.js";

    export async function load() {
        return {
            props: {
                timer: await createLisaMachine(),
            },
        };
    }
</script>

<script>
    import Running from "$lib/components/running.svelte";
    import Setup from "$lib/components/setup.svelte";
    import Transition from "$lib/components/transition.svelte";

    export let timer;

    const { machine_state } = timer;

    $: ({ state: lisa_state } = $machine_state);
</script>

{#if lisa_state === "focus"}
    <Running {timer}/>
{:else if lisa_state === "break"}
    <Running {timer}/>
{:else if lisa_state === "transition"}
    <Transition {timer}/>
{:else}
    You broke me. What did you do?
{/if}
