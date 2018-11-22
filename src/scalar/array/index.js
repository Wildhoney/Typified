import { parseScalar } from '../utils.js';
import { splitTopLevel } from '../../parser/utils.js';
import { Type, isType } from '../../validator/utils.js';

export default function validateArray(validatorFn, ast, collection, generics) {
    const initial = { valid: true, generics };

    if (isType(collection)) {
        const { declaration } = parseScalar(collection.is);
        const types = splitTopLevel(declaration, '|');
        return validatorFn(types, new Type(ast.declaration), generics);
    }

    if (!Array.isArray(collection)) {
        return { valid: false };
    }

    return collection.reduce((accum, value) => {
        const types = splitTopLevel(ast.declaration, '|');
        const result = validatorFn(types, value, generics);
        return {
            valid: accum.valid && result.valid,
            generics: result.generics
        };
    }, initial);
}
