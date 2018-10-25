import * as u from '../general/index.js';
import * as parser from '../parsers/index.js';

export default (ast, parameters) =>
    parameters.reduce((genericMap, value, index) => {
        const type = ast.types[index];
        return validateType(type, ast, value, genericMap);
    }, {});

export const validateType = (type, ast, value, genericMap = {}) => {
    const initial = { map: genericMap, matched: false };
    const actual = u.determineType(value);
    const result = [].concat(type).reduce((model, type) => {
        const expected = genericMap[type] || type;
        const isGeneric = ast.generics.includes(expected);

        if (u.isScalar(type)) {
            const scalar = u.parseScalar(type);
            const fn = `parse${ast.aliases[scalar.type] || scalar.type}`;
            console.assert(u.isFunction(parser[fn]), `Scalar handler \`${fn}\` is not a function.`);
            return parser[fn](scalar.description, ast, value, model.map);
        }

        const isMatch = expected === actual;
        const map = isGeneric && isMatch ? { ...model.map, [expected]: actual } : model.map;
        const matched = model.matched || isGeneric || isMatch;
        return { map, matched };
    }, initial);

    const expected = u.prettifyExpected(genericMap[type] || type);
    !result.matched && u.throwTypeError(expected, actual);
    return result;
};
