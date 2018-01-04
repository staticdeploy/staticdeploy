import { join } from "path";

export default function toAbsolute(path: string) {
    return join("/", path);
}
