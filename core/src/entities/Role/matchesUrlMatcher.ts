import escapeStringRegexp from "escape-string-regexp";

import wildcardChar from "./wildcardChar";

export default function matchesUrlMatcher(
    urlMatcherMatcher: string,
    urlMatcher: string
): boolean {
    if (urlMatcherMatcher.startsWith(wildcardChar)) {
        const urlMatcherMatcherRegex = new RegExp(
            `^[^/]*${escapeStringRegexp(
                urlMatcherMatcher.replace(wildcardChar, "")
            )}`
        );
        return urlMatcherMatcherRegex.test(urlMatcher);
    } else {
        return urlMatcher.startsWith(urlMatcherMatcher);
    }
}
