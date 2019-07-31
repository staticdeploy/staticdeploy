import escapeStringRegexp from "escape-string-regexp";

export default function matchesUrlMatcher(
    urlMatcherMatcher: string,
    urlMatcher: string
): boolean {
    if (urlMatcherMatcher.startsWith("*")) {
        const urlMatcherMatcherRegex = new RegExp(
            `^[^/]*${escapeStringRegexp(urlMatcherMatcher.replace("*", ""))}`
        );
        return urlMatcherMatcherRegex.test(urlMatcher);
    } else {
        return urlMatcher.startsWith(urlMatcherMatcher);
    }
}
