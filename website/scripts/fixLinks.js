/* eslint-disable no-console */
const { load } = require("cheerio");
const { readdirSync, readFileSync, writeFileSync } = require("fs");
const { join } = require("path");

const builtDocsDirPath = join(__dirname, "../build/staticdeploy/docs/");

// Fix links in each doc in the docs folder
console.log("Fixing links in docs...");
readdirSync(builtDocsDirPath).forEach(docFileName => {
    // Load and parse the doc
    const docPath = join(builtDocsDirPath, docFileName);
    const doc = readFileSync(docPath, "utf8");
    const $ = load(doc);

    // Fix relative links in header and sidebar. They should have the parent
    // directory (i.e. the site's root directory) as base instead of the current
    // directory (i.e. $root/docs). Example: ./foo becomes ../foo
    $(".fixedHeaderContainer a, #docsNav a").attr(
        "href",
        (_, href) => (/^\./.test(href) ? `.${href}` : href)
    );

    // Write the changes
    const fixedDoc = $.html();
    writeFileSync(docPath, fixedDoc);
});
console.log("Docs links fixed");
