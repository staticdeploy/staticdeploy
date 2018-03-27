const urlJoin = require("url-join");

const siteConfig = require(`${process.cwd()}/siteConfig.js`);

module.exports = url => urlJoin(siteConfig.baseUrl, url);
