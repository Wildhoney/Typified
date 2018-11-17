import * as parser from './parser/index.js';
import { createValidator, produceValidationReport } from './validator/index.js';
import * as u from './utils.js';

export { addScalarValidator } from './scalar/index.js';

export default function defineType(types, ...expressions) {
    return a => {
        const declaration = u.concatTemplate(types, expressions);

        if (u.isFunction(a)) {
            const f = (...input) => {
                const output = a(...input);
                const parameters = [...input, output];

                // Parse the declaration into its own AST, create the validator context and render the first
                // error encountered if the type declaration is invalid for the values passed.
                const ast = parser.splitTypeDeclaration(declaration);
                const validatorFn = createValidator(ast, declaration, parameters);
                const report = produceValidationReport(validatorFn, ast.types, [...input, output]);
                !report.valid &&
                    (error => {
                        throw new u.TypeMismatchError(error);
                    })(report.error);

                return output;
            };

            f[u.typeDeclaration] = declaration;
            return f;
        }

        return a;
    };
}
