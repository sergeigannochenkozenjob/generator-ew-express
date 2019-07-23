/* eslint-disable import/no-duplicates */
import lodash from './lib/lodash';

declare global {
    import lodash from './lib/lodash';

    declare const _ = lodash;
    declare const __DEV__;
    declare const __TEST__;
    declare const __SERVER__;
    declare const __CLIENT__;
}
