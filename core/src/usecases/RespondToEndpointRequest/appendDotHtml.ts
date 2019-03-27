import { endsWith } from "lodash";

export default function appendDotHtml(path: string): string {
    return endsWith(path, "/") ? `${path.slice(0, -1)}.html` : `${path}.html`;
}
