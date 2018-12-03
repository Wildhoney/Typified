import * as prq from 'promisesque';
// import * as prq from 'https://cdn.jsdelivr.net/npm/promisesque@0.1.1/src/index.js';
import * as parser from './parser/index.js';
import { createValidator, produceValidationReport } from './validator/index.js';
import * as u from './utils.js';

export { addScalarValidator } from './scalar/index.js';

export default function defineType(types, ...expressions) {
    return userFunction => {
        const declaration = u.concatTemplate(types, expressions);

        if (u.isFunction(userFunction)) {
            const f = (...input) => {
                // Parse the declaration into its own AST, create the validator context and render the first
                // error encountered if the type declaration is invalid for the values passed.
                const ast = parser.splitTypeDeclaration(declaration);
                const validatorFn = createValidator(ast, declaration);

                const inputTypes = ast.types.slice(0, ast.types.length - 1);
                const inputReport = produceValidationReport(validatorFn, inputTypes, input);

                return prq.create(inputReport, inputReport => {
                    u.checkReport(inputReport);

                    const outputTypes = ast.types.slice(ast.types.length - 1);
                    const output = userFunction(...input);
                    const outputReport = produceValidationReport(
                        validatorFn,
                        outputTypes,
                        [output],
                        inputReport.generics
                    );

                    return prq.create(outputReport, outputReport => {
                        u.checkReport(outputReport);
                        return output;
                    });
                });
            };

            f[u.typeDeclaration] = declaration;
            return f;
        }

        return userFunction;
    };
}
