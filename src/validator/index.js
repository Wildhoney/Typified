import * as u from './utils.js';

export default function createValidator(ast, declaration) {
    return function(types, value, generics = {}) {
        const expectedTypes = types.map(type => generics[type] || type);
        const actualType = u.getPrimitiveType(value);
        const matchedType = expectedTypes.find(expectedType => expectedType === actualType);
        const genericType = expectedTypes.find(expectedType => ast.generics.includes(expectedType));

        const isTypeValid = Boolean(matchedType || genericType);
        const updatedGenerics = { ...generics, ...(isTypeValid && genericType && { [genericType]: actualType }) };

        return {
            valid: isTypeValid,
            type: isTypeValid ? genericType || matchedType : actualType,
            generics: updatedGenerics,
            error: isTypeValid ? null : u.formatTypeMismatchMessage(expectedTypes, actualType, declaration)
        };
    };
}

// export default function validateDeclaration(ast, declaration, parameters, generics = {}) {
//     const initial = { type: null, generics, errors: [] };

//     return [].concat(parameters).reduce((accum, parameter, index) => {
//         // Handle the processing of the types.
//         const declaredTypes = ast.types[index];
//         const [actualType, newGenerics, feedback] = u.getParameterType(ast, declaredTypes, parameter, accum.generics);
//         const expectedType = [].concat(accum.generics[declaredTypes] || declaredTypes);
//         const matchedTypeIndex = expectedType.findIndex(type => type === actualType);
//         const genericTypeIndex = expectedType.findIndex(type => ast.generics.includes(type));
//         const matchedType = expectedType[matchedTypeIndex];
//         const genericType = expectedType[genericTypeIndex];

//         // Ensure the type is valid and/or a generic type.
//         const isTypeValid = Boolean(matchedType || genericType);
//         const isGenericType = Boolean(genericType);
//         const resolvedType = declaredTypes[matchedTypeIndex] || declaredTypes[genericTypeIndex];

//         // Setup the return for the `reduce` function.
//         const updatedType = isTypeValid ? resolvedType : actualType;
//         const updatedGenerics = {
//             ...generics,
//             ...newGenerics,
//             ...(!isGenericType ? accum.generics : { ...accum.generics, [genericType]: actualType })
//         };
//         const updatedErrors = isTypeValid
//             ? accum.errors
//             : [...accum.errors, u.formatTypeMismatchMessage(expectedType, actualType, declaration, feedback)];

//         return { ...accum, type: updatedType, generics: updatedGenerics, errors: updatedErrors };
//     }, initial);
// }
