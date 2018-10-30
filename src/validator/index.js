import * as parser from '../parser/index.js';
import * as parserUtils from '../parser/utils.js';
import * as u from "./utils.js"

export default function validateDeclaration(declaration, parameters, generics = {}) {
    const ast = parser.splitTypeDeclaration(declaration);
    const initial = { generics, errors: [] };

    return parameters.reduce((accum, parameter, index) => {
        // Handle the processing of the types.
        const actualType = u.getParameterType(parameter);
        const expectedType = [].concat(accum.generics[ast.types[index]] || ast.types[index]);
        const genericType = expectedType.find(type => ast.generics.includes(type));
        const matchedType = expectedType.find(type => {
            const scalarType = parserUtils.maybeParseScalar(type);
            return scalarType ? validateScalar(scalarType) : type === actualType;
        });

        // Ensure the type is valid and/or a generic type.
        const isTypeValid = Boolean(matchedType || genericType);
        const isGenericType = Boolean(genericType);

        // Setup the return for the `reduce` function.
        const generics = !isGenericType ? accum.generics : { ...accum.generics, [genericType]: actualType };
        const errors = isTypeValid
            ? accum.errors
            : [...accum.errors, u.formatTypeMismatchMessage(actualType, expectedType, declaration)];

        return { ...accum, generics, errors };
    }, initial);
}

function validateScalar(scalarType, declaration, parameters, generics = {}) {
    return false;
}
