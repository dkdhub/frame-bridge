let webpack = require('webpack');
var path = require('path');

module.exports = {
    context: __dirname,
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "frame-bridge.min.js"
    },
    mode: 'development',

    optimization: {
        minimize: false
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'stage-0']
                }
            }
        ]
    }
}
