const config = require('./config.js');

module.exports = Object.assign({}, config, {
  testRegex: '\\.e2e\\.js$',
});
