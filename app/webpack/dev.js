const path = require("path");
const merge = require("webpack-merge");

const common = require("./common.js");

module.exports = merge(common, {
    output: {
        publicPath: "/"
    },
    devServer: {
        historyApiFallback: true
    }
});
