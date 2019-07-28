/**
 * Add custom type declarations here
 */

type Nullable<X> = X | null;
type Scalar = string | number | boolean;

// used when it is required to tell that the passed object contains of string keys, and that is it
interface StringToNullableObjectMap {
    [key: string]: Nullable<object>;
}

declare module '*.graphql' {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const content: any;
    export default content;
}
