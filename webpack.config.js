var webpack = require("webpack")
var path = require("path")

module.exports = {
    entry: "./src/app.js",
    output: {
        path:__dirname+ '/public/build',
        filename: "bundle.js",
        sourceMapFilename: "bundle.map",
        publicPath: '/'
    },
    module: {
        rules: [
            {
            
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules$/,
                query: {
                    presets: ['es2015', 'react']
                }
            }
        ]
    }

};