<script>
    import Select, { Option } from "@kwangure/strawberry/components/Select";
    import addMilliseconds from "date-fns/addMilliseconds";
    import Button from "@kwangure/strawberry/components/Button";
    import differenceInMilliseconds from "date-fns/differenceInMilliseconds";
    import Icon from "@kwangure/strawberry/components/Icon";
    import { mdiInformationOutline } from "@mdi/js";
    import minutesToMilliseconds from "date-fns/minutesToMilliseconds";
    import { persistable } from "storables";
    import Time from "@kwangure/strawberry/components/Input/Time";
    import { writable } from "svelte/store";

    export let timer;

    const EIGHTY_MINUTES = minutesToMilliseconds(80);
    const TEN_MINUTES = minutesToMilliseconds(10);

    const { machine_state } = timer;
    const { context: { focus_count, next_phase, alarm_machine }} = $machine_state;
    const scheduled_phase = writable(next_phase);
    const { duration } = persistable({
        name: "duration",
        io: {
            read({ set }) {
                const unsubscribe = scheduled_phase.subscribe((phase) => {
                    const storage_value = JSON.parse(localStorage.getItem(`duration-${phase}`));
                    const default_value = phase === "focus"
                        ? EIGHTY_MINUTES
                        : TEN_MINUTES;

                    set(storage_value || default_value);
                });

                return () => {
                    unsubscribe();
                };
            },
            write(value, { set }) {
                localStorage.setItem(`duration-${$scheduled_phase}`, JSON.stringify(value));
                set(value);
            },
        },
    });

    let phase_start = alarm_machine.context
        ? alarm_machine.context.alarm.end
        : new Date();
    let phase_end;

    $: if (phase_start) handle_duration($duration);
    $: if (phase_end) handle_phase_end(phase_end);

    function handle_phase_end(new_end) {
        $duration = differenceInMilliseconds(new_end, phase_start);
    }

    function handle_duration(duration) {
        phase_end = addMilliseconds(phase_start, duration);
    }

    const next = () => timer.goto($scheduled_phase, phase_start, phase_end);
</script>

<div class="content">
    <div class="form-item">
        Run
        <Select hideLabel bind:value={$scheduled_phase}>
            <Option value={"focus"}>Focus</Option>
            <Option value={"break"}>Break</Option>
        </Select>
        from
        <Time bind:value={phase_start} hideLabel>
            <span slot="label">{$scheduled_phase} start time</span>
        </Time>
        to
        <Time bind:value={phase_end} hideLabel>
            <span slot="label">{$scheduled_phase} end time</span>
        </Time>
    </div>
    <div class="form-item tip">
        {#if focus_count}
            <Icon path={mdiInformationOutline} size="16" />
            You have completed {focus_count} focus session(s).
        {/if}
    </div>
    <div class="form-item">
        <Button primary on:click={next}>
            Start {$scheduled_phase}
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
