import * as u from './utils.js';
import * as validate from './validate.js';

const typeDeclaration = Symbol('typified');

export default ([type]) => a => {
    if (u.isFunction(a)) {
        const f = (...input) => {
            const ast = u.parseType(type);
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
