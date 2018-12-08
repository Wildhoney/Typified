import { splitTypeDeclaration } from '../../../parser/index.js';
import { typeDeclaration } from '../../../utils.js';
import { Type } from '../../utils.js';

export default function validateFunction(validatorFn, ast, value, generics) {
    if (!value[typeDeclaration]) {
        return { valid: true };
    }

    const initial = { valid: true, generics };
    const localAst = splitTypeDeclaration(ast.description);
    const foreignAst = splitTypeDeclaration(value[typeDeclaration]);
    const newType = new Type(null, foreignAst);

    const results = foreignAst.types.reduce((accum, types, index) => {
        const localTypes = localAst.types[index];
        const foreignTypes = types.map(type => newType.set(type));
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
