import { splitTopLevel } from '../../parser/utils.js';

export function validateObject(validatorFn, ast, model, generics) {
    const initial = { valid: true, generics };
    const typeMap = getTypeMap(ast);

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

function getTypeMap(ast) {
    return splitTopLevel(ast.declaration, ',').reduce((accum, declaration) => {
        const type = declaration.trim();
        const { groups } = type.match(/(?<key>.+?):(?<value>.+)/i);
        return { ...accum, [groups.key.trim()]: groups.value.trim() };
    }, {});
}
