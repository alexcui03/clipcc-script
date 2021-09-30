const path = require('path');

const PRODUCTION_MODE = process.env.NODE_ENV;

module.exports = {
    entry: './src/main.ts',
    mode: PRODUCTION_MODE === 'production' ? 'production' : 'development',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'clipcc-script.js'
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            loader: 'ts-loader',
            exclude: /node_modules/
        }]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    }
};
　