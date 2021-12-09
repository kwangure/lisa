module.exports = {
    settings: {
        "import/resolver": {
            alias: {
                map: [
                    // escape `$` to work around eslint's Regex matching
                    ["\\$lib", "./src/apps/dashboard/lib"],
                ],
                extensions: [".js", ".svelte", ".json"],
            },
        },
    },
};
