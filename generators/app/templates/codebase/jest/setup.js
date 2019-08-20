import _ from 'generators/app/templates/codebase/src/lib/lodash';

global._ = _;
global.__TEST__ = true;
global.__DEV__ = false;
global.logger = {
  error: (message, error) => {
    console.error(message);
    console.error(error);
  },
  info: message => {
    console.log(message);
  },
  warn: () => {
    console.log(message);
  },
};
