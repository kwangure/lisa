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
                "storage"
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
