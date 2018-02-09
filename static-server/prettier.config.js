const commonConfig = require("../prettier.config");

module.exports = Object.assign({}, commonConfig, {
    overrides: [{ files: "test/**/*.ts", options: { printWidth: 120 } }]
});
