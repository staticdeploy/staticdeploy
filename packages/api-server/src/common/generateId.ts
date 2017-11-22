import { randomBytes } from "crypto";

export default function generateId(): string {
    return randomBytes(4).toString("hex");
}
