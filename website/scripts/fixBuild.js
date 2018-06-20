/* eslint-disable no-console */
const { load } = require("cheerio");
const fs = require("fs-extra");
const { join } = require("path");

const buildDirPath = join(__dirname, "../build/staticdeploy");
const buildDocsDirPath = join(buildDirPath, "/docs");

// Remove extra folders + index.html-s generated when the cleanUrl option is set
console.log("Removing extra files...");
fs.removeSync(join(buildDirPath, "/notFound"));
fs.removeSync(join(buildDirPath, "/en"));
fs.removeSync(join(buildDirPath, "/img"));
fs.readdirSync(buildDocsDirPath).forEach(docFileName => {
    // Remove the doc if it's a directory
    const docPath = join(buildDocsDirPath, docFileName);
    if (fs.statSync(docPath).isDirectory()) {
        fs.removeSync(docPath);
    }
});
console.log("Extra files removed");

// Fix links in each doc in the docs folder
console.log("Fixing links in docs...");
fs.readdirSync(buildDocsDirPath).forEach(docFileName => {
    // Load and parse the doc
    const docPath = join(buildDocsDirPath, docFileName);
    const doc = fs.readFileSync(docPath, "utf8");
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
    fs.writeFileSync(docPath, fixedDoc);
});
console.log("Docs links fixed");
