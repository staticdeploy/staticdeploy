const path = require("path");
const merge = require("webpack-merge");

const common = require("./common.js");

module.exports = merge(common, {
    devServer: {
        contentBase: common.output.path
    }
});
