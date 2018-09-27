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
    entry: path.resolve(__dirname, "src/js/index.js"),
    output: {
        filename: "js/index.js",
        publicPath: "/",
    },

    plugins: [
        new webpack.HashedModuleIdsPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/[hash:2]/[hash:4]/[hash].css',
            chunkFilename:'css/[hash:2]/[hash:4]/[hash]_[id].css'
        }),
        new HtmlWebpackPlugin({
           filename: "index.html",
            template: path.resolve(__dirname, "src/index.html"),
        }),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [path.resolve(__dirname, "node_modules")],
                use: [
                    {loader: 'file-loader', options: {name: 'js/[hash:2]/[hash:4]/[name]_[hash].[ext]'}},
                    {loader: 'babel-loader',},
                ],
            },
            {
                test: /\.js$/,
                include: [path.resolve(__dirname, 'src/js')],
                use: [
                    {loader: 'babel-loader'},
                ],
            },
            {
                test: /\.(html|htm)$/i,
                use: [
                    { loader: 'html-loader', options: {attrs: ['img:src', 'link:href', 'script:src'], interpolate: true, minifyJS: true,},},
                ],
            },
            {
                test:/\.css$/,
                use: [
                    {loader: 'file-loader', options: {name: 'css/[hash:2]/[hash:4]/[name]_[hash].[ext]'}},
                    {loader: 'extract-loader'},
                    {loader: 'css-loader'},
                ],
            },
        ]
    }
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
    config.plugins.push(new CleanWebpackPlugin([path.resolve(__dirname, "dist")]));
}



module.exports = config;