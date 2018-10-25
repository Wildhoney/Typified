import * as validate from '../validate/index.js';

export const parseArray = (type, ast, values, model) => {
    const expected = ast.aliases[type] || model.map[type] || type;
    const initial = validate.byExpectedType('Array', ast, values, model.map);
    return values.reduce(
        (model, value) => validate.byExpectedType(expected, ast, value, model.map),
        initial
    );
};
