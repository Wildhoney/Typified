import * as u from './utils.js';
import * as parser from './parsers.js';

export const input = (ast, input) =>
    input.reduce((genericMap, value, index) => {
        const type = ast.types[index];
        return validateType(type, ast, value, genericMap);
    }, {});

export const output = (ast, output, genericMap) => {
    const type = ast.types[ast.types.length - 1];
    return validateType(type, ast, output, genericMap);
};

export const validateType = (type, ast, value, genericMap = {}) => {
    const actual = u.getType(value);
    const expected = genericMap[type] || type;

    if (u.isScalarType(type)) {
        const scalar = u.parseScalar(type);
        const parseF = `parse${ast.aliases[scalar.type] || scalar.type}`;
        return parser[parseF](scalar.description, ast, value, genericMap);
    }

    const isGeneric = ast.generics.includes(expected);
    actual !== expected && !isGeneric && u.throwTypeError(expected, actual);
    return isGeneric ? { ...genericMap, [expected]: actual } : genericMap;
};
