import { validateType } from '../validate/index.js';

export const parseArray = (type, ast, values, genericMap) => {
    const expected = ast.aliases[type] || genericMap[type] || type;
    const initial = validateType('Array', ast, values, genericMap);
    return values.reduce((genericMap, value) => validateType(expected, ast, value, genericMap).map, initial);
};
