const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const cssNano = require('cssnano');

const env = process.env.NODE_ENV;

const config = {
    mode: env,
    context: __dirname,
    optimization: {
        minimize: true,
        minimizer: [],
    },
    entry: [path.join(__dirname, "src/js/index.js")],
    output: {
        filename: 'js/[name]_[hash].js',
        path: path.join(__dirname, "dist"),
        publicPath: "/",
    },

    externals: {
        '$': 'jquery',
    },

    plugins: [
        new webpack.HashedModuleIdsPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/[hash:2]/[hash:4]/[hash].css',
            chunkFilename:'css/[hash:2]/[hash:4]/[hash]_[id].css',
        }),
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: path.join(__dirname, "src/index.html"),
        }),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [
                    path.join(__dirname, "node_modules/clipboard"),
                    path.join(__dirname, "node_modules/popper.js"),
                    path.join(__dirname, "node_modules/jquery"),
                    path.join(__dirname, "node_modules/bootstrap"),
                ],
                use: [
                    {loader: 'file-loader', options: {name: 'js/[hash:2]/[hash:4]/[name]_[hash].[ext]'}},
                    {loader: 'babel-loader', options: {cacheDirectory: true}},
                ],
            },
            {
                test: /\.js$/,
                include: [path.join(__dirname, "src/js")],
                use: [
                    {loader: 'babel-loader'},
                ],
            },
            {
                test: /\.(html|htm)$/i,
                use: [
                    {
                        loader: 'html-loader',
                        options: {attrs: ['img:src', 'link:href', 'script:src'], interpolate: true, minifyJS: true,},
                    },
                ],
            },
            {
                test: /\.css$/,
                use: [
                    {loader: 'file-loader', options: {name: 'css/[hash:2]/[hash:4]/[name]_[hash].[ext]'}},
                    {loader: 'extract-loader'},
                    {loader: 'css-loader'},
                ],
            },
        ],
    },
};

if (env === "development") {
    config.devtool = 'source-map';
    config.devServer = {
        contentBase: 'dist',
        inline: true,
        noInfo: false,
        open: true,
        openPage: 'index.html',
        disableHostCheck: true,
    };

    config.entry = ['webpack-dev-server/client/index.js?http://localhost:8080/', path.join(__dirname, "src/js/index.js")];
    config.plugins.push(new webpack.NamedModulesPlugin());
    config.plugins.push(new webpack.HotModuleReplacementPlugin());
} else {
    config.optimization.minimizer.push(new OptimizeCssAssetsPlugin(
        {
            assetNameRegExp: /\.css$/g,
            cssProcessor: cssNano,
            cssProcessorOptions: {discardComments: {removeAll: true}, discardUnused: false},
            canPrint: true
        }
    ));

    config.plugins.push(new MinifyPlugin());
    config.plugins.push(new CleanWebpackPlugin([path.join(__dirname, "dist")]));
}


module.exports = config;
