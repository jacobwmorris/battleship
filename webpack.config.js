const path = require("path");
//const { LoaderOptionsPlugin } = require("webpack");
//const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    /* mode: "production", */
    mode: "development",
    entry: {
        index: "./src/index.js"
    },
    devtool: "inline-source-map",
/*     plugins: [
        new HtmlWebpackPlugin({
            title: "Development",
        }),
    ], */
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"]
            },
        ]
    },
};
