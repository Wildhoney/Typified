import { parseScalar } from '../utils.js';
import { splitTopLevel } from '../../parser/utils.js';
import { isType } from '../../validator/utils.js';

export default function validateArray(validatorFn, ast, collection, generics) {
    if (isType(collection)) {
        const type = collection;
        const { declaration } = parseScalar(type.is);
        const types = splitTopLevel(ast.declaration, '|');
        return validatorFn(types, type.set(declaration), generics);
    }

    if (!Array.isArray(collection)) {
        return { valid: false };
    }

    const initial = { valid: true, generics };

    return collection.reduce((accum, value) => {
        const types = splitTopLevel(ast.declaration, '|');
        const result = validatorFn(types, value, generics);
        return {
            valid: accum.valid && result.valid,
            generics: result.generics
        };
    }, initial);
}
