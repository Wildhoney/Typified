import * as parser from './parser/index.js';
import { createValidator } from './validator/index.js';
import * as u from './utils.js';

export { addScalarValidator } from './scalars/index.js';

export default function type(types, ...expressions) {
    return a => {
        const declaration = u.concatTemplate(types, expressions);

        if (u.isFunction(a)) {
            const f = (...input) => {
                const output = a(...input);
                const parameters = [...input, output];
                const ast = parser.splitTypeDeclaration(declaration);
                const result = createValidator(ast, declaration, parameters);

                result.errors.forEach(error => {
                    // Output any errors that were captured above.
                    throw new u.TypeMismatchError(error);
                });

                return output;
            };

            f[u.typeDeclaration] = declaration;
            return f;
        }

        return a;
    };
}
