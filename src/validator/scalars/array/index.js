import * as parserUtils from '../../../parser/index.js';
import * as u from '../../utils.js';
import validateDeclaration from '../../index.js';

export default function handleArray(ast, declaration, parameters, generics) {
    const initial = { isValid: true, types: [], generics };
    const results = parameters.reduce((accum, parameter) => {
        const scalar = u.getScalarAst(declaration);
        const newAst = parserUtils.splitTypeDeclaration(scalar.declaration);
        const updatedAst = {
            ...newAst,
            aliases: ast.aliases,
            generics: ast.generics
        };
        const result = validateDeclaration(updatedAst, scalar.declaration, [].concat(parameter), accum.generics);
        return {
            ...accum,
            isValid: accum.isValid ? result.errors.length === 0 : false,
            types: [...accum.types, result.type],
            generics: { ...accum.generics, ...result.generics }
        };
    }, initial);

    return {
        isValid: results.isValid,
        generics: results.generics,
        type: `Array(${Array.from(new Set(results.types)).join(', ')})`
    };
}
