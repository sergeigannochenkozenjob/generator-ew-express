import {
    PropertyDescriptor,
    APIVaultRecord,
    DTOVaultRecord,
    DTOType,
    DTORecordParameter,
} from './type';
import { getVaultFor } from './vault';

export const Endpoint = (endpoint: string): Function => {
    return (constructor: Function) => {
        const vault = getVaultFor(constructor) as APIVaultRecord;
        vault.endpoint = endpoint;

        return constructor;
    };
};

export const Get = (endpoint?: string): Function => {
    return (
        target: GenericClass,
        property: string,
        descriptor: PropertyDescriptor,
    ): PropertyDescriptor => {
        const vault = getVaultFor(target.constructor) as APIVaultRecord;
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
        target: GenericClass,
        property: string,
        descriptor: PropertyDescriptor,
    ): PropertyDescriptor => {
        const vault = getVaultFor(target.constructor) as APIVaultRecord;
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
        target: GenericClass,
        property: string,
        descriptor: PropertyDescriptor,
    ): PropertyDescriptor => {
        const vault = getVaultFor(target.constructor) as APIVaultRecord;
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
        target: GenericClass,
        property: string,
        descriptor: PropertyDescriptor,
    ): PropertyDescriptor => {
        const vault = getVaultFor(target.constructor) as APIVaultRecord;
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
        target: GenericClass,
        property: string,
        descriptor: PropertyDescriptor,
    ): PropertyDescriptor => {
        const vault = getVaultFor(target.constructor) as APIVaultRecord;
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

export const BodyInput = (dto?: DTOType): Function => {
    return (
        target: GenericClass,
        property: string,
        descriptor: PropertyDescriptor,
    ): PropertyDescriptor => {
        const vault = getVaultFor(target.constructor) as APIVaultRecord;
        vault.methods = vault.methods || {};
        vault.methods[property] = vault.methods[property] || {};
        Object.assign(vault.methods[property], {
            bodyDTO: dto,
        });

        return descriptor;
    };
};

export const Output = (dto?: DTOType): Function => {
    return (
        target: GenericClass,
        property: string,
        descriptor: PropertyDescriptor,
    ): PropertyDescriptor => {
        const vault = getVaultFor(target.constructor) as APIVaultRecord;
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
        const vault = getVaultFor(constructor) as DTOVaultRecord;
        vault.isDTO = true;

        return constructor;
    };
};

export const Attribute = (params: DTORecordParameter): Function => {
    return (
        target: GenericClass,
        property: string,
        descriptor: PropertyDescriptor,
    ): PropertyDescriptor => {
        const vault = getVaultFor(target.constructor) as DTOVaultRecord;
        vault.attributes = vault.attributes || {};

        vault.attributes[property] = Object.assign(
            {},
            {
                params,
            },
        );

        return descriptor;
    };
};
