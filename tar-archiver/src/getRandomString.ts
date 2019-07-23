import { randomBytes } from "crypto";

export default function getRandomString() {
    return randomBytes(8).toString("hex");
}
