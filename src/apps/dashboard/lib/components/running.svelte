<script>
    import differenceInMilliseconds from "date-fns/differenceInMilliseconds";
    import format from "date-fns/format";
    import { formatMilliseconds } from "~@utils/time";
    import Icon from "@kwangure/strawberry/components/Icon";
    import { mdiClockOutline } from "@mdi/js";
    import minutesToMilliseconds from "date-fns/minutesToMilliseconds";
    import secondsToMilliseconds from "date-fns/secondsToMilliseconds";

    export let timer;

    const { machine_state } = timer;
    const SIXTY_SECONDS = secondsToMilliseconds(60);
    const SIXTY_MINUTES = minutesToMilliseconds(60);

    $: ({ state, context: { alarm_machine = {}}} = $machine_state);
    $: ({ alarm, remaining } = alarm_machine.context);
    $: ({ start, end } = alarm);
    $: startTime = format(new Date(start), "h:mm aaa");
    $: endTime = format(new Date(end), "h:mm aaa");
    $: clockTime = formatMilliseconds(remaining, {
        format: (() => {
            if (remaining < SIXTY_SECONDS) return ["seconds"];
            if (remaining < SIXTY_MINUTES) return ["minutes"];
            return ["hours", "minutes"];
        })(),
        formatter: { xHours: "h", xMinutes: "m", xSeconds: "s" },
        delimiter: " ",
        zero: true,
    });
    $: difference = differenceInMilliseconds(new Date(end), new Date(start));
    $: percent = remaining/difference * 100;

    function preserve_focus(event) {
        event.returnValue = "Timer is currently running. Close anyway?";
    }
</script>

<svelte:window on:beforeunload={preserve_focus}/>

<div class="timer {state}">
    <div class="title">
        Focusing
    </div>
    <div class="time">
        <Icon path={mdiClockOutline}/> {startTime} - {endTime}
    </div>
    <div class="svg-countdown">
        <Icon>
            <circle class="under"/>
            <circle class="over" style="--percent: {percent};"/>
        </Icon>
        <div class="countdown-time">
            {clockTime}
        </div>
    </div>
</div>

<style>
    .timer {
        display: grid;
        grid-template-columns: max-content 1fr max-content;
        grid-template-areas:
            "a b d"
            "z c d";
        padding: 5px 20px;
        border-radius: var(--br-border-radius);
        cursor: pointer;
        background-color: var(--br-grey-lightest);
        line-height: 1;
    }
    .icon, .title, .time {
        display: flex;
        align-items: center;
    }
    .icon {
        grid-area: a;
    }
    .title {
        grid-area: b;
    }
    .time {
        grid-area: c;
    }
    .time {
        color: var(--br-grey);
    }
    .time :global(.berry-icon) {
        --br-icon-size: 18px;
        margin-right: 5px;
    }
    .svg-countdown,
    .time {
        font-size: 12px;
    }
    .svg-countdown {
        position: relative;
        grid-area: d;
        --svg-size: 54px;
        width: var(--svg-size);
        height: var(--svg-size);
    }
    .svg-countdown > :global(*) {
        position: absolute;
        height: 100%;
        width: 100%;
        inset: 0;
    }
    .svg-countdown :global(.berry-icon) {
        --br-icon-size: 32px;
    }
    .countdown-time {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    circle {
        --viewBox: 24;
        --stroke-width: 2;
        --radius: calc(var(--viewBox)/2 - calc(var(--stroke-width)/2));
        --center: calc(var(--viewBox)/2);
        stroke-width: var(--stroke-width);
        r: var(--radius);
        cx: var(--center);
        cy: var(--center);
        stroke-linecap: round;
        fill: transparent;
    }
    circle.under {
        stroke: var(--br-primary-light);
    }
    circle.over {
        --PI: 3.141;
        --circumference: calc(var(--radius) * 2 * var(--PI));
        --percent: 0;
        stroke: var(--br-primary);
        stroke-dasharray: var(--circumference) var(--circumference);
        stroke-dashoffset: calc(var(--circumference) - var(--percent) / 100 * var(--circumference));
        transform: rotate(-90deg);
        transform-origin: 50%;
    }
    .timer.focus circle.over {
        stroke: var(--br-blue);
    }
    .timer.focus circle.under {
        stroke: var(--br-blue-light);
    }
    .timer.shortBreak circle.over,
    .timer.longBreak circle.over{
        stroke: var(--br-green);
    }
    .timer.shortBreak circle.under,
    .timer.longBreak circle.under{
        stroke: var(--br-green-light);
    }
</style>
