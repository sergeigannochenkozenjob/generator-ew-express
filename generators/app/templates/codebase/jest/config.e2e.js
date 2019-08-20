const config = require('./config.js');

module.exports = {
    ...config,
    testRegex: '\\.e2e\\.js$',
    setupFiles: [
        ...config.setupFiles,
        '<rootDir>/../jest/env-seed.js',
    ],
};
