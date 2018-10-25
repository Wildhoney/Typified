import * as u from '../general/index.js';
import * as parser from '../parsers/index.js';

export const byParameters = (ast, parameters) =>
    parameters.reduce((genericMap, value, index) => {
        const type = ast.types[index];
        return byExpectedType(type, ast, value, genericMap);
    }, {});

export const byExpectedType = (type, ast, value, genericMap = {}) => {
    const initial = { map: genericMap, matched: false };
    const actual = u.determineType(value);
    const result = [].concat(type).reduce((model, type) => {
        const expected = model.map[type] || type;
        const isGeneric = ast.generics.includes(expected);

        if (u.isScalar(type)) {
            const scalar = u.parseScalar(type);
            const fn = `parse${ast.aliases[scalar.type] || scalar.type}`;
            return parser[fn](scalar.description, ast, value, model);
        }

        const isMatch = expected === actual;
        const map = isGeneric ? { ...model.map, [expected]: actual } : model.map;
        const matched = model.matched || isGeneric || isMatch;
        return { map, matched };
    }, initial);

    const expected = u.prettifyExpected(genericMap[type] || type);
    !result.matched && u.throwTypeError(expected, actual);
    return result;
};
