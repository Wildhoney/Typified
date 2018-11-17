import { splitTypeDeclaration } from '../../parser/index.js';
import { typeDeclaration } from '../../utils.js';

export default function handleFunction(validatorFn, ast, fn, generics) {
    const sourceAst = splitTypeDeclaration(ast.declaration);
    const destinationAst = splitTypeDeclaration(fn[typeDeclaration]);
    const initial = { valid: true, generics };

    return destinationAst.types.reduce((accum, expectedTypes, index) => {
        const result = expectedTypes
            .map(expectedType => {
                const expectedTypes = sourceAst.types[index];
                return validatorFn(expectedTypes, null, accum.generics, expectedType);
            })
            .find(({ valid }) => valid);

        return {
            valid: accum.valid && (result ? result.valid : false),
            generics: { ...accum.generics, ...(result && result.generics) }
        };
    }, initial);
}
