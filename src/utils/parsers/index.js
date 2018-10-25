import * as validate from '../validate/index.js';

export const parseArray = (type, ast, values, genericMap) => {
    const expected = ast.aliases[type] || genericMap[type] || type;
    const initial = validate.validateType('Array', ast, values, genericMap);
    return values.reduce(
        (genericMap, value) =>
            validate.validateType(expected, ast, value, genericMap).map,
        initial
    );
};
