<script>
    import addMinutes from "date-fns/addMinutes";
    import Button from "@kwangure/strawberry/components/Button";
    import Icon from "@kwangure/strawberry/components/Icon";
    import { mdiInformationOutline } from "@mdi/js";
    import Time from "@kwangure/strawberry/components/Input/Time";

    export let timer;

    const { machine_state } = timer;

    $: ({ context: { focus_count, next_phase, alarm_machine }} = $machine_state);
    $: ({ context: { alarm: { end: phase_start }}} = alarm_machine);
    $: phase_end = addMinutes(phase_start, next_phase === "focus" ? 80 : 10);

    const next = () => timer.next(phase_start, phase_end);
</script>

<div class="content">
    <div class="form-item">
        Run {next_phase} from
        <Time bind:value={phase_start} hideLabel>
            <span slot="label">{next_phase} start time</span>
        </Time>
        to
        <Time bind:value={phase_end} hideLabel>
            <span slot="label">{next_phase} end time</span>
        </Time>
    </div>
    <div class="form-item tip">
        <Icon path={mdiInformationOutline} size="16" />
        You have completed {focus_count} focus session(s).
    </div>
    <div class="form-item">
        <Button primary on:click={next}>
            Start {next_phase}
        </Button>
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
        margin-bottom: 5px;
    }
    .tip {
        margin-top: 15px;
        display: flex;
        align-items: center;
        font-size: 12px;
    }
    .tip :global(.berry-icon) {
        margin: 0 6px 0 4px;
        color: var(--br-primary);
    }
</style>
