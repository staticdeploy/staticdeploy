import escapeStringRegexp from "escape-string-regexp";

import wildcardChar from "./wildcardChar";

export default function matchesName(
    nameMatcher: string,
    name: string
): boolean {
    const unanchoredRegexString = nameMatcher
        .split(wildcardChar)
        .map(escapeStringRegexp)
        .join(".*");
    const nameMatcherRegex = new RegExp(`^${unanchoredRegexString}$`);
    return nameMatcherRegex.test(name);
}
