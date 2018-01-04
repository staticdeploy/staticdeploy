import { join } from "path";

export default function appendSlash(path: string): string {
    return join(path, "/");
}
