import safeJsonStringify from "safe-json-stringify";

// Use the regular JSON.stringify for speed, or - on errors - fall back to the
// safe-json-stringify library
export default function fastSafeJsonStringify(obj: any) {
    try {
        return JSON.stringify(obj);
    } catch (err) {
        return safeJsonStringify(obj);
    }
}
