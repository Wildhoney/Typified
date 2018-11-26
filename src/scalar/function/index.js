import { splitTypeDeclaration } from '../../parser';
import { Type } from '../../validator/utils';
import { typeDeclaration } from '../../utils';

export default function validateFunction(validatorFn, ast, value, generics) {
    if (!value[typeDeclaration]) {
        return { valid: true };
    }

    const initial = { valid: true, generics };
    const localAst = splitTypeDeclaration(ast.declaration);
    const foreignAst = splitTypeDeclaration(value[typeDeclaration]);

    const results = foreignAst.types.reduce((accum, types, index) => {
        const localTypes = localAst.types[index];
        const foreignTypes = types.map(type => new Type(type, foreignAst));
        const result = foreignTypes
            .map(foreignType => validatorFn(localTypes, foreignType, accum.generics))
            .find(({ valid }) => valid) || { valid: false, generics: accum.generics };

        return {
            valid: accum.valid && result.valid,
            generics: result.generics
        };
    }, initial);

    return { valid: results.valid };
}
