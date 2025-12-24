
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: "production",
    entry: "./src/index.js", 
    output: {
        filename: "main.js",
        path: path.resolve(__dirname,"dist"),
        clean: true,
    },
    devtool: "source-map",
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/template.html",
        }),
        new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // all options are optional
        filename: "[name].css",
        chunkFilename: "[id].css",
        }),
    ],

    module:{
        rules:[
            {
                test: /\.css$/i,
                use: [
                MiniCssExtractPlugin.loader, // 1. Extracts CSS into separate files
                "css-loader", // 2. Interprets @import and url()
                ],
            },
            {
                test: /\.html$/i,
                loader: "html-loader",
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: "asset/resource",
            },
        ],
    },
};