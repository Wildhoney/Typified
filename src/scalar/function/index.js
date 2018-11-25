import { splitTypeDeclaration } from '../../parser';
import { Type } from '../../validator/utils';

export default function validateFunction(validatorFn, ast, declaration, generics) {
    if (!declaration) {
        return { valid: true };
    }

    const initial = { valid: true, generics };
    const { types } = splitTypeDeclaration(ast.declaration);

    const results = types.reduce((accum, types, index) => {
        const result = declaration[index]
            .map(declarationType => validatorFn(types, new Type(declarationType), accum.generics))
            .find(({ valid }) => valid) || { valid: false, generics: accum.generics };

        return {
            valid: accum.valid && result.valid,
            generics: result.generics
        };
    }, initial);

    return { valid: results.valid };
}
