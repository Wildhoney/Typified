import { splitTypeDeclaration } from '../../parser';

export default function validateFunction(validatorFn, ast, declaration, generics) {
    const initial = { valid: true, generics };
    const { types } = splitTypeDeclaration(ast.declaration);

    const results = types.reduce((accum, types, index) => {
        const result = declaration[index]
            .map(declarationType => validatorFn(types, declarationType, accum.generics))
            .find(({ valid }) => valid) || { valid: false, generics: accum.generics };

        return {
            valid: accum.valid && result.valid,
            generics: result.generics
        };
    }, initial);

    return { valid: results.valid };
}
