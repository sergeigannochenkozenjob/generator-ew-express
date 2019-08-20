/**
 * https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore
 */

const isObject = (arg: unknown) => arg !== null && (typeof arg === 'object' || typeof arg === 'function');

export default {
    isArray: Array.isArray,
    isObject,
    isFunction: (arg: unknown) => typeof arg === 'function',
    isArrayNotEmpty: (arg: unknown) => {
        return Array.isArray(arg) && arg.length > 0;
    },
    isObjectNotEmpty: (arg: unknown) => {
        return isObject(arg) && Object.keys(arg as object).length > 0;
    },
    isStringNotEmpty: (arg: unknown) => {
        return typeof arg === 'string' && arg.length > 0;
    },
    union: (arg1: any[], arg2: any[]) => [...arg1, ...arg2],
    intersection: (...args: any[][]) => args.reduce((a, b) => a.filter(c => b.includes(c))),
    difference: (...args: any[][]) => args.reduce((a, b) => a.filter(c => !b.includes(c))),
};
