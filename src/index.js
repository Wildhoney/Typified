import validate from './validator/index.js';
import * as u from './utils.js';

const typeDeclaration = Symbol('@typified/type-declaration');

export default function type(types, ...expressions) {
    return a => {
        const declaration = u.concatTemplate(types, expressions);

        if (u.isFunction(a)) {
            const f = (...input) => {
                const output = a(...input);
                const parameters = [...input, output];
                validate(declaration, parameters);
                return output;
            };

            f[typeDeclaration] = declaration;
            return f;
        }

        return a;
    };
}
