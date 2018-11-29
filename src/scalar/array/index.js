import { parseScalar } from '../utils.js';
import { splitTopLevel } from '../../parser/utils.js';
import { isType } from '../../validator/utils.js';

export default function validateArray(validatorFn, ast, collection, generics) {
    const initial = { valid: true, generics };
    const types = splitTopLevel(ast.declaration, '|');

    if (isType(collection)) {
        const type = collection;
        const { declaration } = parseScalar(type.is);
        return validatorFn(types, type.set(declaration), generics);
    }

    if (!Array.isArray(collection)) {
        return { valid: false };
    }

    return collection.reduce((accum, value) => {
        const result = validatorFn(types, value, generics);
        return {
            valid: accum.valid && result.valid,
            generics: result.generics
        };
    }, initial);
}
