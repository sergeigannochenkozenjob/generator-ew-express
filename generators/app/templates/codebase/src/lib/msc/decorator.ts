import { PropertyDescriptor, StringMap } from './type';
import { getVaultFor, hasVaultFor } from './vault';

export const Endpoint = (endpoint: string): Function => {
    return (constructor: Function) => {
        const vault = getVaultFor(constructor);
        vault.endpoint = endpoint;

        return constructor;
    };
};

export const Get = (endpoint?: string): Function => {
    return (
        target,
        property: string,
        descriptor: PropertyDescriptor,
    ): PropertyDescriptor => {
        const vault = getVaultFor(target.constructor);
        vault.methods = vault.methods || {};
        vault.methods[property] = vault.methods[property] || {};
        Object.assign(vault.methods[property], {
            endpoint,
            method: 'get',
            fn: descriptor.value,
        });

        return descriptor;
    };
};

export const Post = (endpoint?: string): Function => {
    return (
        target,
        property: string,
        descriptor: PropertyDescriptor,
    ): PropertyDescriptor => {
        const vault = getVaultFor(target.constructor);
        vault.methods = vault.methods || {};
        vault.methods[property] = vault.methods[property] || {};
        Object.assign(vault.methods[property], {
            endpoint,
            method: 'post',
            fn: descriptor.value,
        });

        return descriptor;
    };
};

export const Put = (endpoint?: string): Function => {
    return (
        target,
        property: string,
        descriptor: PropertyDescriptor,
    ): PropertyDescriptor => {
        const vault = getVaultFor(target.constructor);
        vault.methods = vault.methods || {};
        vault.methods[property] = vault.methods[property] || {};
        Object.assign(vault.methods[property], {
            endpoint,
            method: 'put',
            fn: descriptor.value,
        });

        return descriptor;
    };
};

export const Patch = (endpoint?: string): Function => {
    return (
        target,
        property: string,
        descriptor: PropertyDescriptor,
    ): PropertyDescriptor => {
        const vault = getVaultFor(target.constructor);
        vault.methods = vault.methods || {};
        vault.methods[property] = vault.methods[property] || {};
        Object.assign(vault.methods[property], {
            endpoint,
            method: 'patch',
            fn: descriptor.value,
        });

        return descriptor;
    };
};

export const Delete = (endpoint?: string): Function => {
    return (
        target,
        property: string,
        descriptor: PropertyDescriptor,
    ): PropertyDescriptor => {
        const vault = getVaultFor(target.constructor);
        vault.methods = vault.methods || {};
        vault.methods[property] = vault.methods[property] || {};
        Object.assign(vault.methods[property], {
            endpoint,
            method: 'delete',
            fn: descriptor.value,
        });

        return descriptor;
    };
};

export const BodyInput = (dto?: Function): Function => {
    return (
        target,
        property: string,
        descriptor: PropertyDescriptor,
    ): PropertyDescriptor => {
        const vault = getVaultFor(target.constructor);
        vault.methods = vault.methods || {};
        vault.methods[property] = vault.methods[property] || {};
        Object.assign(vault.methods[property], {
            bodyDTO: dto,
        });

        return descriptor;
    };
};

export const Output = (dto?: Function): Function => {
    return (
        target,
        property: string,
        descriptor: PropertyDescriptor,
    ): PropertyDescriptor => {
        const vault = getVaultFor(target.constructor);
        vault.methods = vault.methods || {};
        vault.methods[property] = vault.methods[property] || {};
        Object.assign(vault.methods[property], {
            outputDTO: dto,
        });

        return descriptor;
    };
};

export const DTO = (): Function => {
    return (constructor: Function) => {
        const vault = getVaultFor(constructor);
        vault.isDTO = true;

        return constructor;
    };
};

export const Attribute = (params: StringMap): Function => {
    return (
        target,
        property: string,
        descriptor: PropertyDescriptor,
    ): PropertyDescriptor => {
        const { initializer } = descriptor;

        const vault = getVaultFor(target.constructor);
        vault.attributes = vault.attributes || {};

        vault.attributes[property] = Object.assign(
            {},
            {
                params,
                value: initializer ? initializer() : null,
            },
        );

        return descriptor;
    };
};
