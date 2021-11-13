import { assign, createMachine, interpret } from "xstate";
import create_alarm_machine from "./alarm.js";
import { readable } from "svelte/store";

export default function create_lisa_machine() {
    let alarm_machine;
    const lisa_machine = createMachine({
        initial: "setup",
        context: {
            alarm_machine: {},
        },
        states: {
            setup: {},
            focus: {
                entry: (context, event) => {
                    alarm_machine = create_alarm_machine(context, event);
                    alarm_machine.onTransition((state) => {
                        send("LISA.ALARM_UPDATE", { value: { context: state.context }});
                    });
                },
            },
        },
        on: {
            "FOCUS": "focus",
            "LISA.ALARM_UPDATE": {
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
            if (event.type !== "LISA.ALARM_UPDATE") return;
            set({ state: value, context });
        });
    });
    return {
        machine_state: lisa_state,
        focus: (start, end) => send("FOCUS", { value: { start, end }}),
    };
}
