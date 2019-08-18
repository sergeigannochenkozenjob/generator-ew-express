/* eslint-disable import/no-duplicates, import/order */
import lodash from './lib/lodash';

declare global {
    import { logger as logger_ } from 'ew-internals';
    import lodash from './lib/lodash';

    declare const _ = lodash;
    declare const logger = logger_;
    declare const __DEV__;
    declare const __TEST__;
}
