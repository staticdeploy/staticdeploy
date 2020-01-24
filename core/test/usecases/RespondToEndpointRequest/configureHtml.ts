import { expect } from "chai";
import { load } from "cheerio";

import configureHtml, {
    SELECTOR
} from "../../../src/usecases/RespondToEndpointRequest/configureHtml";

describe("configureHtml", () => {
    const html = Buffer.from(`
            <!doctype html>
            <html>
                <head>
                    <title>title</title>
                    <script id="app-config" src="/app-config.js"></script>
                </head>
                <body>
                </body>
            </html>
        `);
    const configurationScriptContent = 'window.APP_CONFIG={"KEY":"VALUE"};';

    it(`injects the provided configuration script into the supplied html buffer, inside ${SELECTOR}`, () => {
        const configuredHtml = configureHtml(
            html,
            configurationScriptContent
        ).toString();
        const $ = load(configuredHtml);
        const scriptContent = $(SELECTOR).html();
        expect(scriptContent).to.have.string(
            'window.APP_CONFIG={"KEY":"VALUE"};'
        );
    });

    it(`removes the src attribute from ${SELECTOR}`, () => {
        const configuredHtml = configureHtml(
            html,
            configurationScriptContent
        ).toString();
        const $ = load(configuredHtml);
        const scriptSrc = $(SELECTOR).attr("src");
        expect(scriptSrc).to.equal(undefined);
    });
});
