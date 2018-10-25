import * as u from '../general/index.js';
import * as parser from '../parsers/index.js';

export default (ast, input) =>
    input.reduce((genericMap, value, index) => {
        const type = ast.types[index];
        return validateType(type, ast, value, genericMap);
    }, {});

export const validateType = (type, ast, value, genericMap = {}) => {
    const actual = u.determineType(value);
    const result = [].concat(type).reduce(
        (model, type) => {
            const expected = genericMap[type] || type;

            if (u.isScalar(type)) {
                const scalar = u.parseScalar(type);
                const parseF = `parse${ast.aliases[scalar.type] ||
                    scalar.type}`;
                return parser[parseF](
                    scalar.description,
                    ast,
                    value,
                    model.map
                );
            }

            const isGeneric = ast.generics.includes(expected);
            const map = isGeneric
                ? { ...model.map, [expected]: actual }
                : model.map;
            const matched = model.matched || isGeneric || expected === actual;
            return { map, matched };
        },
        { map: genericMap, matched: false }
    );

    const expected = []
        .concat(type)
        .map(type => genericMap[type] || type)
        .join(' | ');
    !result.matched && u.throwTypeError(expected, actual);
    return result;
};
