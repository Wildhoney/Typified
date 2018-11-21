import { splitTopLevel } from '../../parser/utils.js';
import * as u from './utils.js';

export default function validateObject(validatorFn, ast, model, generics) {
    const initial = { valid: true, generics };
    const typeMap = u.getTypeMap(ast.declaration);

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
