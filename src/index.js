import * as u from './utils/general/index.js';
import validate from './utils/validate/index.js';

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
            const output = a(...input);
            validate(ast, [...input, output]);
            return output;
        };

        f[typeDeclaration] = type;
        return f;
    }

    return a;
};
