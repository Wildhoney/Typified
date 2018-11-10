import * as u from './utils.js';

export default function validateDeclaration(ast, declaration, parameters, generics = {}) {
    const initial = { type: null, generics, errors: [] };

    return [].concat(parameters).reduce((accum, parameter, index) => {
        // Handle the processing of the types.
        const declaredTypes = ast.types[index];
        const [actualType, newGenerics, feedback] = u.getParameterType(ast, declaredTypes, parameter, accum.generics);
        const expectedType = [].concat(accum.generics[declaredTypes] || declaredTypes);
        const matchedTypeIndex = expectedType.findIndex(type => type === actualType);
        const genericTypeIndex = expectedType.findIndex(type => ast.generics.includes(type));
        const matchedType = expectedType[matchedTypeIndex];
        const genericType = expectedType[genericTypeIndex];

        
        // Ensure the type is valid and/or a generic type.
        const isTypeValid = Boolean(matchedType || genericType);
        const isGenericType = Boolean(genericType);
        const resolvedType = declaredTypes[matchedTypeIndex] || declaredTypes[genericTypeIndex];
        
        // Setup the return for the `reduce` function.
        const updatedType = isTypeValid ? resolvedType : actualType;
        const updatedGenerics = {
            ...generics,
            ...newGenerics,
            ...(!isGenericType ? accum.generics : { ...accum.generics, [genericType]: actualType })
        };
        const updatedErrors = isTypeValid
            ? accum.errors
            : [...accum.errors, u.formatTypeMismatchMessage(expectedType, actualType, declaration, feedback)];

        return { ...accum, type: updatedType, generics: updatedGenerics, errors: updatedErrors };
    }, initial);
}
