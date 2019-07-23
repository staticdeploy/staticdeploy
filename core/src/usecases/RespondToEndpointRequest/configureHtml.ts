import { load } from "cheerio";

import { IConfiguration } from "../../entities/Configuration";

// Only exported for testing
export const SELECTOR = "script#app-config";

export default function configureHtml(
    html: Buffer,
    config: IConfiguration
): Buffer {
    const configScript = `window.APP_CONFIG=${JSON.stringify(config)};`;
    const $ = load(html.toString());
    $(SELECTOR)
        .removeAttr("src")
        .html(configScript);
    const configuredHtml = $.html();
    return Buffer.from(configuredHtml);
}
