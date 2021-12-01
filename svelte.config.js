import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function resolve(pathname) {
    return path.resolve(__dirname, pathname);
}

export default {
    patootie: {
        manifest: {
            permissions: [
                // Required from `chrome.storage.`
                "storage",
                // Required to access URL field in `chrome.tabs.onUpdated` callback
                "tabs",
            ],
        },
        vite: () => ({
            resolve: {
                alias: {
                    "~@static": resolve("./static/"),
                    "~@utils": resolve("./src/utils/"),
                },
            },
        }),
    },
};
