const commonConfig = require("../prettier.config");

module.exports = {
    ...commonConfig,
    overrides: [{
        files: "test/**/*.ts",
        options: {
            printWidth: 120
        }
    }]
};
