const path = require('path');

module.exports = {
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'babel-loader',
                exclude: /node_modules/
            }, {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    entry: {
        main: path.join(__dirname, 'src', 'entry.tsx')
    },
    output: {
        globalObject: 'self',
        path: path.join(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    resolve: {
        extensions: [ '.ts', '.tsx', '.js', '.scss' ]
    },
    devtool: 'source-map',
    watch: true
}

/**
 * Living mice
 * Haggstrom
 * Fly me to the moon
 * Chris
 * Sweden
 * Cat
 * Danny
 */

/**
 * Thirteen
 */