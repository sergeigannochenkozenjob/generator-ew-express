const path = require('path');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');
const resolve = require('resolve');
const NodemonPlugin = require('nodemon-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin-alt');

module.exports = (env, argv) => {
    env = env || {};
    const development =
      argv.mode === 'development' || env.NODE_ENV === 'development';

    const sourceFolder = path.join(__dirname, 'src');
    const destinationFolder = path.join(__dirname, 'build');

    const debuggerPort = process.env.NETWORK__PORT__DEBUGGER || 3001;

    return {
        entry: path.join(sourceFolder, 'index.js'),
        target: 'node',
        node: {
            __filename: true,
            __dirname: true,
        },
        externals: [nodeExternals()],
        mode: development ? 'development' : 'production',
        output: {
            libraryTarget: 'commonjs',
            path: destinationFolder,
            filename: 'index.js',
        },
        resolve: {
            extensions: ['.ts', '.js'],
            symlinks: false,
        },
        devtool: development ? 'source-map' : 'none',
        module: {
            rules: [
                {
                    test: /\.(j|t)s?$/,
                    enforce: 'pre',
                    use: [
                        {
                            options: {
                                eslintPath: require.resolve('eslint'),
                                emitWarning: true,
                            },
                            loader: require.resolve('eslint-loader'),
                        },
                    ],
                    include: sourceFolder,
                    exclude: /node_modules/,
                },
                {
                    test: /\.(graphql|gql)$/,
                    exclude: /node_modules/,
                    loader: 'graphql-tag/loader',
                },
                {
                    test: /\.(j|t)s?$/,
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
                                    '@babel/preset-typescript',
                                ],
                                plugins: [
                                    [
                                        '@babel/plugin-proposal-decorators',
                                        { legacy: true },
                                    ],
                                    '@babel/plugin-proposal-object-rest-spread',
                                    '@babel/plugin-proposal-class-properties',
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
            ],
        },
        plugins: [
            new ForkTsCheckerWebpackPlugin({
                typescript: resolve.sync('typescript', {
                    basedir: path.join(__dirname, 'node_modules'),
                }),
                async: false,
                checkSyntacticErrors: true,
                tsconfig: path.join(__dirname, 'tsconfig.json'),
                compilerOptions: {
                    module: 'esnext',
                    moduleResolution: 'node',
                    resolveJsonModule: true,
                    isolatedModules: true,
                    noEmit: true,
                },
                reportFiles: [
                    '**',
                    '!**/*.json',
                    '!**/__test__/**',
                    '!**/?(*.)(spec|test).*',
                ],
                watch: sourceFolder,
                silent: true,
            }),
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
            new webpack.ProvidePlugin({
                _: [path.join(sourceFolder, `lib/lodash.js`), 'default'],
                logger: ['ew-internals', 'logger'],
            }),
            new webpack.DefinePlugin({
                __DEV__: development,
                __TEST__: false,
            }),
            development && new NodemonPlugin({
                nodeArgs: development ? [`--inspect=0.0.0.0:${debuggerPort}`] : [],
                watch: destinationFolder,
                ext: 'js,ts,graphql',
            }),
        ].filter(x => !!x),
    };
};
