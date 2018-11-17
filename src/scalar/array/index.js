import { splitTopLevel } from '../../parser/utils.js';

export default function handleArray(validatorFn, ast, collection, generics) {
    const initial = { valid: true, generics };

    const result = collection.reduce((accum, value) => {
        const types = splitTopLevel(ast.declaration, '|');
        const result = validatorFn(types, value, generics);
        return { valid: accum.valid && result.valid, generics: result.generics };
    }, initial);

    return result;
}
