/*
*   create-react-app does not play well with yarn workspaces, which hoist
*   dependencies at the project root. Therefore we can't use it (or its
*   TypeScript-oriented fork wmonk/create-react-app-typescript), and we have to
*   "manually configure" webpack. Ejecting caused too much noise (too many
*   files, too much unnecessary logic), so we just started from scratch copying
*   bits and pieces from cra-typescript.
*
*   TODO: wait for facebook/create-react-app#3435 to be resolved and merged into
*   cra-typescript, then give it another shot.
*/
const CleanWebpackPlugin = require("clean-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
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
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin([`${root}/build`], { root }),
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
        new ExtractTextPlugin("main.[contenthash:8].css"),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ],
    node: {
        dgram: "empty",
        fs: "empty",
        net: "empty",
        tls: "empty",
        child_process: "empty"
    }
};
