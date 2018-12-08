import { splitTopLevel, parseScalar } from '../../../parser/utils.js';
import { isType } from '../../utils.js';

export default function validateArray(validatorFn, ast, collection, generics) {
    const initial = { valid: true, generics };
    const types = splitTopLevel(ast.description, '|');

    if (isType(collection)) {
        const type = collection;
        const { description } = parseScalar(type.is);
        return validatorFn(types, type.set(description), generics);
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
