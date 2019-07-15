const path = require('path');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');
const NodemonPlugin = require('nodemon-webpack-plugin');<% if (supportTS) { %>
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');<% } %>

module.exports = (env, argv) => {
    env = env || {};
    const development =
      argv.mode === 'development' || env.NODE_ENV === 'development';

    const debuggerPort = process.env.NETWORK__PORT__DEBUGGER || 3001;

    return {
        entry: path.join(__dirname, 'src/index.js'),
        target: 'node',
        node: {
            __filename: true,
            __dirname: true,
        },
        externals: [nodeExternals()],
        mode: development ? 'development' : 'production',
        output: {
            libraryTarget: 'commonjs',
            path: path.join(__dirname, 'build'),
            filename: 'index.js',
        },
        resolve: {
            extensions: ['.ts', '.js'],
            symlinks: false,
        },
        module: {
            rules: [
                {
                    test: /\.(graphql|gql)$/,
                    exclude: /node_modules/,
                    loader: 'graphql-tag/loader',
                },
                {
                    test: /\.js$/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: [
                                    [
                                        '@babel/env',
                                        {
                                            targets: { node: '8.10' },
                                        },
                                    ],
                                ],
                                plugins: [
                                    '@babel/plugin-proposal-object-rest-spread',
                                ],
                                cacheDirectory: true,
                            },
                        },
                    ],
                },
                {
                    test: /\.(txt|html)$/,
                    use: 'raw-loader',
                },
                <% if (supportTS) { %>
                {
                    test: /\.tsx?$/,
                    loaders: [
                        {
                            loader: 'ts-loader',
                            options: {
                                transpileOnly: true,
                            },
                        },
                    ],

                    exclude: /node_modules/,
                },
                <% } %>
            ],
        },
        plugins: [
            new webpack.ProvidePlugin({
                _: [path.join(__dirname, `src/lib/lodash.js`), 'default'],
              logger: ['ew-internals', 'logger'],
            }),
            new webpack.DefinePlugin({
                __DEV__: development,
                __TEST__: false,
            }),
            new NodemonPlugin({
              nodeArgs: development ? [`--inspect=0.0.0.0:${debuggerPort}`] : [],
              watch: path.join(__dirname, 'build'),
            }),<% if (supportTS) { %>
            new ForkTsCheckerWebpackPlugin({
              watch: path.join(__dirname, 'src'),
            }),<% } %>
        ],
    };
};
