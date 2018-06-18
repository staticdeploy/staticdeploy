import { join } from "path";

export default function appendIndexDotHtml(path: string): string {
    return join(path, "/index.html");
}
