var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var extractTranslationKeysRegexPlugin = require('webpack-extract-translation-keys-regex-plugin');

module.exports = {
    entry: './index.js',
    output: {
        path: path.resolve(__dirname, ''),
        filename: 'dist/js/react-dom-inspector.min.js'},
    module: {
        loaders: [
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract(['css-loader', 'less-loader'])
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract(['css-loader'])
            },
            {
                test: /\.(png|jpg|woff|woff2|eot|ttf|otf)$/,
                loaders: ['file-loader']
            },
            {
                test: /\.(svg)$/,
                loaders: ['svg-url-loader']
            },
            {
                test: /.js?$/,
                loader: 'babel-loader',
                exclude: [
                    path.resolve(__dirname, 'node_modules')
                ],
                query: {
                    plugins: [
                        'transform-runtime',
                        'transform-class-properties',
                        'transform-es3-member-expression-literals',
                        'transform-es3-property-literals',
                        'syntax-class-properties'
                    ],
                    presets: ['es2015', 'react']
                }
            }
        ]
    },
    watchOptions: {
        ignored: [
            path.resolve(__dirname, 'docs/assets'),
            path.resolve(__dirname, 'docs/assets/*/*'),
            path.resolve(__dirname, 'docs/assets/js/react-dom-inspector.min.js'),
            path.resolve(__dirname, 'docs/assets/css/style.min.css'),
            path.resolve(__dirname, 'node_modules')
        ]
    },
    plugins: [

        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),

        new ExtractTextPlugin({
            filename: 'dist/css/style.min.css',
            allChunks: true
        }),

        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.min\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: {discardComments: {removeAll: true}, zindex: false},
            canPrint: true
        }),

        new webpack.optimize.AggressiveMergingPlugin(),

        new extractTranslationKeysRegexPlugin({
            functionReplace: 'polyglot.t($2$4$1$3$2$4',
            functionPattern: /polyglot\.t\(\s*(?:"([^"\\]*(?:\\.[^"\\]*)*)(")|'([^'\\]*(?:\\.[^'\\]*)*)('))/gm,
            output: path.join(__dirname, 'dist', 'translations', 'english.json')
        }),

        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                screw_ie8: true
            },
            comments: false,
            sourceMap: false
        }),

        new webpack.optimize.AggressiveMergingPlugin(),

        new CopyWebpackPlugin([
            {from: 'dist/js/react-dom-inspector.min.js', to: 'docs/assets/js/react-dom-inspector.min.js'},
            {from: 'dist/js/react-dom-inspector.min.js.map', to: 'docs/assets/js/react-dom-inspector.min.js.map'},
            {from: 'dist/css/style.min.css', to: 'docs/assets/css/style.min.css'}
        ])
    ],
    devtool: 'cheap-module-source-map'
};

