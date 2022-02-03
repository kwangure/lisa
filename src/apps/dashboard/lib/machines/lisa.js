import { assign, createMachine, interpret } from "xstate";
import { blocked_urls_store } from "$lib/storage/blocked_patterns.js";
import calm_audio from "../../static/audio/gmail_notification_calm.mp3";
import create_alarm_machine from "./alarm.js";
import { focus } from "../chrome";
import isAfter from "date-fns/isAfter";
import isBefore from "date-fns/isBefore";
import { matchPattern } from "browser-extension-url-match";
import { navigate } from "../chrome.js";
import { readable } from "svelte/store";
import welcome_audio from "../../static/audio/gmail_notification_welcome.mp3";

function block_tab(patterns, tab, { start, end }) {
    const { id, url } = tab;
    for (const pattern of patterns.values()) {
        const { last_ignored_history_entry } = pattern;
        if (
            last_ignored_history_entry
            && isAfter(last_ignored_history_entry, start)
            && isBefore(last_ignored_history_entry, end)
        ) return;

        if (pattern.matcher.match(url)) {
            const query = [`url=${encodeURIComponent(url)}`];
            if (pattern.name) {
                query.push(`name=${encodeURIComponent(pattern.name)}`);
            }
            navigate(id, `/dashboard/index.html?${query.join("&")}#!/blocked`);
            break;
        }
    }
}

export default function create_lisa_machine() {
    let alarm_machine;
    const lisa_machine = createMachine({
        initial: "transition",
        context: {
            alarm_machine: {},
            focus_count: 0,
            break_count: 0,
            next_phase: "focus",
            previous_phase: null,
            patterns: new Map(),
        },
        states: {
            setup: {},
            focus: {
                entry: [
                    "create_alarm_machine",
                    "block_open_tabs",
                ],
                on: {
                    BLOCK_TABS: {
                        actions: "block_open_tabs",
                    },
                },
                exit: [
                    assign({
                        focus_count: (context) => context.focus_count + 1,
                        previous_phase: "focus",
                        next_phase: "break",
                    }),
                ],
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
                entry: "create_alarm_machine",
                exit: assign({
                    break_count: (context) => context.break_count + 1,
                    previous_phase: "break",
                    next_phase: "focus",
                }),
            },
        },
        on: {
            "GOTO.BREAK": "break",
            "GOTO.FOCUS": "focus",
            "GOTO.TRANSITION": "transition",

            "UPDATE.PATTERN": {
                actions: [
                    assign({
                        patterns: (_context, event) => event.value.patterns,
                    }),
                    "block_open_tabs",
                ],
            },

            "UPDATE.ALARM": {
                actions: assign((context, event) => {
                    Object.assign(context.alarm_machine, event.value);
                    return context;
                }),
            },
        },
    }, {
        actions: {
            async block_open_tabs(context, event, meta) {
                if (meta.state.value === "transition") return;

                const { patterns, alarm_machine } = context;

                let start, end;
                if (event.type === "NEXT") {
                    ({ start, end } = event.value);
                } else {
                    ({ start, end } = alarm_machine.context.alarm);
                }

                const tabs = event.type === "BLOCK_TABS"
                    ? event.value
                    : await chrome.tabs.query({});

                for (const tab of tabs) {
                    block_tab(patterns, tab, { start, end });
                }
            },
            create_alarm_machine(context, event, meta) {
                alarm_machine = create_alarm_machine(context, event);
                alarm_machine.onTransition((state) => {
                    send("UPDATE.ALARM", { value: { context: state.context }});
                });
                alarm_machine.onDone(() => {
                    const audio = meta.state.value === "focus"
                        ? welcome_audio
                        : calm_audio;
                    (new Audio(audio)).play();
                    focus();
                    send("GOTO.TRANSITION");
                });
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

        function updateListener(_, __, tab) {
            send("BLOCK_TABS", { value: [tab]});
        }

        chrome.tabs.onUpdated.addListener(updateListener);

        return () => {
            chrome.tabs.onUpdated.removeListener(updateListener);
        };
    });

    const { lisaBlocked } = blocked_urls_store;
    lisaBlocked.subscribe((value) => {
        const active_patterns = new Map();
        for (const blocked_url of value) {
            const { name, patterns, ignored_history } = blocked_url;
            const { length } = ignored_history;
            const last_ignored_history_entry = length
                && new Date(ignored_history[length - 1]);

            for (const pattern of patterns) {
                active_patterns.set(pattern, {
                    name,
                    last_ignored_history_entry,
                    matcher: matchPattern(pattern),
                });
            }
        }
        send("UPDATE.PATTERN", { value: { patterns: active_patterns }});
    });

    return {
        machine_state: lisa_state,
        next: (start, end) => send("NEXT", { value: { start, end }}),
    };
}
