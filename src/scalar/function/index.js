import { splitTypeDeclaration } from '../../parser';
import { Type } from '../../validator/utils';

export default function validateFunction(validatorFn, ast, declaration, generics) {
    const initial = { valid: true, generics };
    const { types } = splitTypeDeclaration(ast.declaration);

    const results = types.reduce((accum, type, index) => {
        const types = declaration[index];
        const result = type
            .map(type => validatorFn(types, new Type(type), accum.generics))
            .find(({ valid }) => valid) || { valid: false, generics: accum.generics };

        return {
            valid: accum.valid && result.valid,
            generics: result.generics
        };
    }, initial);

    return { valid: results.valid };
}
