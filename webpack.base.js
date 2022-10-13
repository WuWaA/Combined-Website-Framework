const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: "development",
    entry:
    {
        main: './public/main.js'
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'style.css',
            chunkFilename: '[name].css',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.jsx$|\.es6$|\.js$/,
                use: {
                    loader: 'babel-loader'
                },
                exclude: '/node_modules/'
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: "css-loader"
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sassOptions: {
                                includePaths: [path.resolve('./node_modules'), path.resolve('./public')]
                            }
                        }
                    }]
            }
        ]
    },
    output: {
        path: path.resolve('./public'),
        filename: 'bundle.js',
        publicPath: '/'
    }
};