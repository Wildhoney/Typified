import * as prq from 'https://cdn.jsdelivr.net/npm/promisesque@0.2.0/src/index.js';
import * as parser from './parser/index.js';
import createValidator from './validator/index.js';
import createReporter from './reporter/index.js';
import * as u from './utils.js';

export { addScalarValidator } from './validator/scalar/index.js';

export default function defineType(types, ...expressions) {
    return userFunction => {
        const declaration = u.concatTemplate(types, expressions);
        const ast = parser.splitTypeDeclaration(declaration);

        if (u.isFunction(userFunction)) {
            const userFunctionWrapped = (...input) => {
                // Parse the declaration into its own AST, create the validator context and render the first
                // error encountered if the type declaration is invalid for the values passed.
                const inputReporter = createReporter(ast, createValidator(ast, declaration));

                return prq.get(inputReporter(input), outputReporter => {
                    const output = userFunction(...input);
                    return prq.get(outputReporter(output), () => output);
                });
            };

            userFunctionWrapped[u.typeDeclaration] = declaration;

            // Define the name for the passed function that is being typed.
            ast.name && Object.defineProperty(userFunctionWrapped, 'name', { value: ast.name, writable: false });

            return userFunctionWrapped;
        }

        return userFunction;
    };
}
