const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const webpack = require("webpack");

const root = path.join(__dirname, "/..");

module.exports = {
    entry: `${root}/src/index.tsx`,
    output: {
        path: `${root}/build`,
        filename: "main.[chunkhash:8].js"
    },
    devtool: "source-map",
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: require.resolve("source-map-loader"),
                enforce: "pre",
                include: `${root}/src`
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: require.resolve("url-loader"),
                options: { limit: 16384 }
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            },
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(
                process.env.NODE_ENV || "development"
            ),
            "process.env.VERSION": JSON.stringify(
                require("../package.json").version
            )
        }),
        new HtmlWebpackPlugin({
            inject: true,
            template: `${root}/public/index.html`
        }),
        new MiniCssExtractPlugin({ filename: "main.[contenthash:8].css" }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ]
};
