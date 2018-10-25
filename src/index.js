import * as u from './utils/general/index.js';
import * as validate from './utils/validate/index.js';

const typeDeclaration = Symbol('@typified/type-declaration');

export default (types, ...expressions) => a => {
    const type = types
        .map((type, index) => {
            const expression = expressions[index];
            return `${type} ${expression ? expression : ''}`;
        })
        .join('');

    if (u.isFunction(a)) {
        const f = (...input) => {
            const ast = u.parseTypeDeclaration(type);
            const genericMap = validate.input(ast, input);
            const output = a(...input);
            validate.output(ast, output, genericMap);
            return output;
        };

        f[typeDeclaration] = type;
        return f;
    }

    return a;
};
