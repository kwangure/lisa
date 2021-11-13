module.exports = {
    root: true,
    extends: [
        "@kwangure/eslint-config-svelte",
    ],
    plugins: ["import"],
    settings: {
        "import/resolver": {
            alias: {
                map: [
                    ["~@utils", "./src/utils/"],
                    ["~@static", "./static/"],

                    ["\\$lib", "./lib/"],
                ],
                extensions: [".js", ".svelte", ".json"],
            },
        },
    },
};
