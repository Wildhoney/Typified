import * as parserUtils from '../../../parser/utils.js';
import * as u from '../../utils.js';
import validateDeclaration from '../../index.js';

export default function handleObject(ast, declaration, parameters, generics) {
    const initial = { isValid: true, types: [], generics };

    const scalar = u.getScalarAst(declaration);
    const types = parserUtils.splitTopLevel(scalar.declaration, ',').reduce((accum, declaration) => {
        const type = declaration.trim();
        const { groups } = type.match(/(?<key>.+?):(?<value>.+)/i);
        return { ...accum, [groups.key.trim()]: groups.value.trim() };
    }, {});

    const results = Object.entries(parameters).reduce((accum, [key, parameter], index) => {
        if (!(key in types)) {
            return { ...accum, isValid: false };
        }

        const expectedType = types[key];
        const updatedAst = {
            types: [parserUtils.splitTopLevel(expectedType, '|')],
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
