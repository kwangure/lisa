<script>
    import addMinutes from "date-fns/addMinutes";
    import Button from "@kwangure/strawberry/components/Button";
    import Time from "@kwangure/strawberry/components/Input/Time";

    export let timer;

    let focus_start = new Date();
    let focus_end = addMinutes(focus_start, 80);

    const focus = () => timer.focus(focus_start, focus_end);
</script>

<div class="content">
    <div class="form-item">
        Focus from:
        <Time bind:value={focus_start} hideLabel>
            <span slot="label">Start focus time</span>
        </Time>
        to
        <Time bind:value={focus_end} hideLabel>
            <span slot="label">End focus time</span>
        </Time>
    </div>
    <div class="form-item">
        <Button primary on:click={focus}>Start Focus</Button>
    </div>
</div>

<style>
    .content :global(.berry-input-radio) {
        margin-bottom: 10px;
    }
    .content :global(.berry-input-radio),
    .content :global(.berry-input-radio [slot="label"]) {
        display: flex;
        align-items: center;
        gap: 1ch;
    }
    .form-item {
        margin-bottom: 10px;
    }
</style>
