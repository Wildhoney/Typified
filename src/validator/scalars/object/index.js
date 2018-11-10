import * as parserUtils from '../../../parser/utils.js';
import * as u from '../../utils.js';
import validateDeclaration from '../../index.js';

export default function handleObject(ast, declaration, parameters, generics) {
    const initial = { isValid: true, types: [], generics };

    const scalar = u.getScalarAst(declaration);
    const types = parserUtils.splitTopLevel(scalar.declaration, ',').map(a => a.trim());

    const results = types.reduce((accum, type) => {
        const { groups } = type.match(/(?<key>.+?):(?<value>.+)/i);
        const [key, expectedType] = [groups.key.trim(), groups.value.trim()];
        const types = parserUtils.splitTopLevel(expectedType, '|');
        const parameter = parameters[key];
        const updatedAst = {
            types: [types],
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

    const type = results.isValid ? declaration : `Object(???)`;

    return {
        type,
        isValid: results.isValid,
        generics: results.generics
    };
}
