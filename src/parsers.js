import * as validate from './validate.js';

export const parseArray = (type, ast, values, genericMap) => {
    const expected = ast.aliases[type] || genericMap[type] || type;

    return values.reduce(
        (genericMap, value) => ({
            ...genericMap,
            ...validate.validateType(expected, ast, value, genericMap)
        }),
        validate.validateType('Array', ast, values, genericMap)
    );
};
