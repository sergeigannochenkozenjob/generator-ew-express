import * as yup from 'yup';
import { getVaultFor } from './vault';
import { StringMap } from './type';

const cache = new Map();

export const getValidator = (dto: any, depth = 1): object => {
    if (depth > 30) {
        return null;
    }

    const vault = getVaultFor(dto);

    if (!vault || !vault.isDTO) {
        return null;
    }

    if (depth === 1 && cache[dto]) {
        return cache[dto];
    }

    let result = yup.object();

    const { attributes } = vault;
    if (!_.ione(attributes)) {
        return result;
    }

    Object.keys(attributes as StringMap).forEach((attributeName: string) => {
        const {
            params: { required, type },
        } = attributes[attributeName];
        const shape = {};

        let subType = null;
        let fieldType = type;
        let isArray = false;
        if (_.isArray(type)) {
            [fieldType] = type;
            isArray = true;
        }

        if (_.isFunction(fieldType)) {
            subType = getValidator(fieldType, depth + 1);
        } else {
            // only basic stuff so far
            if (fieldType === 'string') {
                subType = yup.string();
            } else if (fieldType === 'number') {
                subType = yup.number();
            } else if (fieldType === 'boolean') {
                subType = yup.boolean();
            } else {
                subType = yup.string();
            }
        }

        if (subType === null) {
            throw new Error(`No DTO found for "${attributeName}" attribute`);
        }

        if (isArray) {
            subType = yup.array().of(subType);
        }

        if (required) {
            subType = subType.required();
        }

        // todo: show "path" here
        subType = subType.typeError(
            `Member "${attributeName}" should be of type "${type}"`,
        );

        shape[attributeName] = subType;

        result = result.shape(shape);
    });

    if (depth === 1) {
        cache[dto] = result;
    }

    return result;
};

export const filterStructure = (
    structure: StringMap,
    dto: Function,
    depth = 1,
): StringMap => {
    if (depth > 30) {
        return {};
    }

    const vault = getVaultFor(dto);

    if (!vault || !vault.isDTO) {
        return {};
    }

    const { attributes } = vault;
    if (!_.ione(attributes)) {
        return {};
    }

    const legalKeys = _.intersection(
        Object.keys(structure),
        Object.keys(attributes),
    );

    const result = {};
    legalKeys.forEach((key: string) => {
        const attribute = attributes[key];
        const {
            params: { type },
        } = attribute;
        const structureValue = structure[key];

        if (_.isArray(type)) {
            const [subType] = type;
            if (_.isArray(structure[key])) {
                // check each subitem
                if (_.isFunction(subType)) {
                    result[key] = structureValue.map((subValue: any) =>
                        filterStructure(subValue, subType, depth + 1),
                    );
                } else {
                    result[key] = structureValue;
                }
            } else {
                result[key] = [];
            }
        } else {
            if (_.isFunction(type)) {
                result[key] = filterStructure(structureValue, type, depth + 1);
            } else {
                result[key] = structureValue;
            }
        }
    });

    return result;
};
