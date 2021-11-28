import { assign, createMachine, interpret } from "xstate";
import calm_audio from "../../static/audio/gmail_notification_calm.mp3";
import create_alarm_machine from "./alarm.js";
import { readable } from "svelte/store";
import welcome_audio from "../../static/audio/gmail_notification_welcome.mp3";

export default function create_lisa_machine() {
    let alarm_machine;
    const lisa_machine = createMachine({
        initial: "setup",
        context: {
            alarm_machine: {},
            focus_count: 0,
            previous_phase: null,
        },
        states: {
            setup: {},
            focus: {
                entry: (context, event) => {
                    alarm_machine = create_alarm_machine(context, event);
                    alarm_machine.onTransition((state) => {
                        send("UPDATE.ALARM", { value: { context: state.context }});
                    });
                    alarm_machine.onDone(() => {
                        (new Audio(welcome_audio)).play();
                        send("GOTO.TRANSITION");
                    });
                },
                exit: assign({
                    focus_count: (context) => context.focus_count + 1,
                    previous_phase: "focus",
                    next_phase: "break",
                }),
            },
            transition: {
                on: {
                    NEXT: [{
                        target: "focus",
                        cond: (context) => context.next_phase === "focus",
                    }, {
                        target: "break",
                        cond: (context) => context.next_phase === "break",
                    }],
                },
            },
            break: {
                entry: (context, event) => {
                    alarm_machine = create_alarm_machine(context, event);
                    alarm_machine.onTransition((state) => {
                        send("UPDATE.ALARM", { value: { context: state.context }});
                    });
                    alarm_machine.onDone(() => {
                        (new Audio(calm_audio)).play();
                        send("GOTO.TRANSITION");
                    });
                },
                exit: assign({
                    focus_count: (context) => context.focus_count + 1,
                    previous_phase: "break",
                    next_phase: "focus",
                }),
            },
        },
        on: {
            "GOTO.BREAK": "break",
            "GOTO.FOCUS": "focus",
            "GOTO.TRANSITION": "transition",

            "UPDATE.ALARM": {
                actions: assign((context, event) => {
                    Object.assign(context.alarm_machine, event.value);
                    return context;
                }),
            },
        },
    });

    const lisa_service = interpret(lisa_machine).start();
    const { send, state: { value, context }} = lisa_service;
    const lisa_state = readable({ state: value, context }, (set) => {
        lisa_service.onTransition((state) => {
            const { value, context, event } = state;
            if (
                !event.type.startsWith("UPDATE.")
                && !event.type.startsWith("GOTO.")
            ) return;
            set({ state: value, context });
        });
    });
    return {
        machine_state: lisa_state,
        focus: (start, end) => send("GOTO.FOCUS", { value: { start, end }}),
        next: (start, end) => send("NEXT", { value: { start, end }}),
    };
}
