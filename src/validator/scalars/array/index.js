import * as parser from '../../../parser/index.js';
import * as u from '../../utils.js';
import validateDeclaration from '../../index.js';

export default function handleArray(ast, declaration, parameters, generics) {
    const initial = { isValid: true, types: [], generics };

    if (!Array.isArray(parameters)) {
        return {
            type: u.getPrimitiveType(parameters),
            isValid: false,
            feedback: 'Expected an array but received a primitive'
        };
    }

    const scalar = u.getScalarAst(declaration);
    const newAst = parser.splitTypeDeclaration(scalar.declaration);
    const results = parameters.reduce((accum, parameter) => {
        const updatedAst = {
            ...newAst,
            aliases: ast.aliases,
            generics: ast.generics
        };
        const result = validateDeclaration(updatedAst, scalar.declaration, [parameter], accum.generics);
        return {
            ...accum,
            isValid: accum.isValid ? result.errors.length === 0 : false,
            types: [...accum.types, result.type],
            generics: { ...accum.generics, ...result.generics }
        };
    }, initial);

    const type = results.isValid ? declaration : `Array(${Array.from(new Set(results.types)).join(', ')})`;

    return {
        type,
        isValid: results.isValid,
        generics: results.generics,
        feedback: results.types.length > 1 && 'Array values must be of a single type'
    };
}
