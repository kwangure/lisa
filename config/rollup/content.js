import common, {
    CONTENT_DIR,
    CONTENT_OUT,
    CSS_OUT, DEV,
    JS_ENTRY_OUT,
} from "./common.js";
import postcss from "rollup-plugin-postcss";
import { preprocessConfig } from "@kwangure/strawberry/config";
import replace from "@rollup/plugin-replace";
import svelte from "rollup-plugin-svelte";

const WEB_COMPONET_POSTFIX = "wc.svelte";

export default {
    input: "src/content/index.js",
    output: {
        dir: CONTENT_OUT,
        entryFileNames: JS_ENTRY_OUT,
        format: "esm",
        sourcemap: "inline",
    },
    plugins: [
        ...common.plugins,
        replace({
            __CONTENT_CSS__: `${CONTENT_DIR}/${CSS_OUT}`,
        }),
        svelte({
            preprocess: preprocessConfig,
            exclude: `**/*.${WEB_COMPONET_POSTFIX}`,
            emitCss: true,
            compilerOptions: {
                dev: DEV,
            },
        }),
        svelte({
            include: `**/*.${WEB_COMPONET_POSTFIX}`,
            compilerOptions: {
                customElement: true,
                dev: DEV,
            },
        }),
        postcss({
            extract: `${CSS_OUT}`,
        }),
    ],
    onwarn: common.onwarn,
    preserveEntrySignatures: false,
};
