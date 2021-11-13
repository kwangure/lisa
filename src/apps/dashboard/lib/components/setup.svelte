<script>
    import addMinutes from "date-fns/addMinutes";
    import Button from "@kwangure/strawberry/components/Button";
    import Time from "@kwangure/strawberry/components/Input/Time";

    export let timer;

    let focusStart = new Date();
    let focusEnd = addMinutes(focusStart, 90);

    const focus = () => timer.focus(focusStart, focusEnd);
</script>

<div class="content">
    <div class="form-item">
        You've not yet started Lisa. Focus from:
        <Time bind:value={focusStart} hideLabel>
            <span slot="label">Start focus time</span>
        </Time>
        to
        <Time bind:value={focusEnd} hideLabel>
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
