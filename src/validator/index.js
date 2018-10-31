import * as parserUtils from '../parser/utils.js';
import * as scalars from '../scalars/index.js';
import * as u from './utils.js';

export default function validateDeclaration(ast, declaration, parameters, generics = {}) {
    const initial = { generics, errors: [] };

    return [].concat(parameters).reduce((accum, parameter, index) => {
        // Handle the processing of the types.
        const actualType = u.getParameterType(parameter);
        const expectedType = [].concat(accum.generics[ast.types[index]] || ast.types[index]);
        const genericType = expectedType.find(type => ast.generics.includes(type));

        // Validate all of the scalars and primitives.
        const validationResult = findMatchedType(ast, expectedType, parameter, accum, actualType);
        const matchedType = validationResult && validationResult.matchedType;

        // Ensure the type is valid and/or a generic type.
        const isTypeValid = Boolean(matchedType || genericType);
        const isGenericType = Boolean(genericType);

        // Setup the return for the `reduce` function.
        const updatedGenerics = {
            ...(validationResult ? validationResult.generics : []),
            ...(!isGenericType ? accum.generics : { ...accum.generics, [genericType]: actualType })
        };
        const updatedErrors = isTypeValid
            ? accum.errors
            : [...accum.errors, u.formatTypeMismatchMessage(expectedType, actualType, declaration)];

        return { ...accum, generics: updatedGenerics, errors: updatedErrors };
    }, initial);
}

function findMatchedType(ast, expectedType, parameter, accum, actualType) {
    return expectedType
        .map(type => {
            const scalarType = parserUtils.maybeParseScalar(type);
            return scalarType
                ? scalars.validate(scalarType, ast, parameter, accum.generics)
                : { matchedType: type, valid: type === actualType, generics: [] };
        })
        .find(result => result.valid);
}
