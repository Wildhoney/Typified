import { splitTopLevel, parseScalar } from '../../parser/utils.js';
import * as u from './utils.js';
import { isType } from '../../validator/utils.js';

export default function validateObject(validatorFn, ast, model, generics) {
    const initial = { valid: true, generics };
    const typeMap = u.getTypeMap(ast.description);

    if (isType(model)) {
        const type = model;
        const { description } = parseScalar(type.is);
        const targetTypeMap = u.getTypeMap(description);

        return Object.entries(typeMap).reduce((accum, [key, value]) => {
            if (!typeMap[key]) {
                return { valid: false };
            }

            const types = splitTopLevel(typeMap[key], '|');
            const result = validatorFn(types, type.set(targetTypeMap[key]), generics);

            return {
                valid: accum.valid && result.valid,
                generics: result.generics
            };
        }, initial);
    }

    if (Object.keys(model).length !== Object.keys(typeMap).length) {
        return { valid: false };
    }

    return Object.entries(model).reduce((accum, [key, value]) => {
        if (!typeMap[key]) {
            return { valid: false };
        }

        const types = splitTopLevel(typeMap[key], '|');
        const result = validatorFn(types, value, generics);

        return {
            valid: accum.valid && result.valid,
            generics: result.generics
        };
    }, initial);
}
