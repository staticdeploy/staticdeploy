const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const merge = require("webpack-merge");

const common = require("./common.js");

module.exports = merge(common, {
    mode: "production",
    optimization: {
        minimizer: [
            new TerserPlugin({ parallel: true, sourceMap: true }),
            new OptimizeCSSAssetsPlugin({})
        ]
    }
});
