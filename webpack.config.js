const path = require("path");
//const { LoaderOptionsPlugin } = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "production",
    /* mode: "development", */
    entry: {
        index: "./src/index.js"
    },
    devtool: "inline-source-map",
    plugins: [
        new HtmlWebpackPlugin({
            title: "Development",
            template: "./src/page.html"
        }),
    ],
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "docs"),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource'
            },
        ]
    },
};
