import { load } from "cheerio";

// Only exported for testing
export const SELECTOR = "script#app-config";

export default function configureHtml(
    html: Buffer,
    configurationScriptContent: string
): Buffer {
    const $ = load(html.toString());
    $(SELECTOR)
        .removeAttr("src")
        .html(configurationScriptContent);
    const configuredHtml = $.html();
    return Buffer.from(configuredHtml);
}
