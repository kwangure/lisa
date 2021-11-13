import { assign, createMachine, interpret } from "xstate";

export default function create_alarm_machine(_context, event) {
    const alarm_machine = createMachine({
        initial: "running",
        context: {
            alarm: {
                start: event.value.start,
                end: event.value.end,
            },
        },
        states: {
            running: {
                entry: "calculateRemaining",
                after: {
                    1000: {
                        target: "running",
                        actions: "calculateRemaining",
                    },
                },
                always: [{
                    target: "completed",
                    cond: (context) => context.remaining <= 0,
                }],
            },
            completed: {
                type: "final",
            },
        },
    }, {
        actions: {
            calculateRemaining: assign((context) => {
                const end = new Date(context.alarm.end).getTime();
                const now = new Date().getTime();
                context.remaining = end - now;
                return context;
            }),
        },
    });

    const alarm_service = interpret(alarm_machine).start();

    return alarm_service;
}
