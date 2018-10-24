import * as u from './utils.js';

export const input = (ast, input) => {
    return input.reduce((genericMap, value, index) => {
        const type = ast.types[index];
        return validateType(type, ast, value, genericMap);
    }, {});
};

export const output = (ast, output, genericMap) => {
    const type = ast.types[ast.types.length - 1];
    return validateType(type, ast, output, genericMap);
};

const validateType = (type, ast, value, genericMap = {}) => {
    const actual = value.constructor.name;
    const expected = genericMap[type] || type;
    const isGeneric = ast.generics.includes(expected);
    actual !== expected && !isGeneric && u.throwTypeError(expected, actual);
    return isGeneric ? { ...genericMap, [expected]: actual } : genericMap;
};
