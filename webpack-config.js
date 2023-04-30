// Require path.
const path = require( 'path' );

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// clean out build dir in-between builds
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// Configuration object.
const config = {
    // Create the entry points.
    // One for frontend and one for the admin area.
    entry: {
        // frontend and admin will replace the [name] portion of the output config below.
        admin: [
            './src/admin/js/admin.js',
            './src/admin/scss/admin.scss',
        ],
    },

    // Create the output files.
    // One for each of our entry points.
    output: {
        // [name] allows for the entry object keys to be used as file names.
        filename: 'js/[name].min.[fullhash].js',
        // Specify the path to the JS files.
        path: path.resolve( __dirname, 'assets' )
    },

    // Setup a loader to transpile down the latest and great JavaScript so older browsers
    // can understand it.
    module: {
        rules: [
            {
                // Look for any .js files.
                test: /\.js$/,
                // Exclude the node_modules folder.
                exclude: /node_modules/,
                // Use babel loader to transpile the JS files.
                loader: 'babel-loader'
            },
            // sass compilation
            {
                test: /\.(sass|scss)$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            },
        ]
    },
    plugins: [
        // clear out build directories on each build
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [
                './js/*',
                './css/*'
            ]
        }),
        // css extraction into dedicated file
        new MiniCssExtractPlugin({
            filename: './css/admin.min.[fullhash].css'
        }),
    ]
}

// Export the config object.
module.exports = config;