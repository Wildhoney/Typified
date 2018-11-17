import * as u from './utils.js';
import { handleScalar } from '../scalar/index.js';

export function createValidator(ast, declaration) {
    return function validatorFn(types, value, generics = {}) {
        // Map each of the expected types by inspecting the generics and the defined aliases, otherwise the
        // type as it's passed is taken. We also determine the primitive type of the value, which may or may
        // not be a scalar type at this point.
        const expectedTypes = types.map(type => generics[type] || ast.aliases[type] || type);
        const actualType = u.getPrimitiveType(value);

        // Find the indices that match either the generic type or the concrete type, recursing when
        // a scalar is found by delegating to the correct scalar validator, if it exists.
        const matchedResults = expectedTypes.map(expectedType => {
            return u.isScalar(expectedType)
                ? handleScalar(validatorFn, expectedType, value, generics)
                : { valid: expectedType === actualType };
        });
        const matchedTypeIndex = matchedResults.findIndex(result => result.valid);
        const genericTypeIndex = expectedTypes.findIndex(expectedType => ast.generics.includes(expectedType));

        // Resolved the above indices to actual types, either concrete or generic. Also find the `originalType`
        // which is the type that matched from the types past to the function initially.
        const genericType = expectedTypes[genericTypeIndex];
        const matchedType = expectedTypes[matchedTypeIndex];
        const originalType = types[genericTypeIndex] || types[matchedTypeIndex];

        // If we have a matched type then take the generics and the message from that result.
        const scalarResults = matchedResults[matchedTypeIndex] || {};

        // Determine if the type is valid and update the generics if the type is indeed valid.
        const isTypeValid = Boolean(matchedType || genericType);
        const updatedGenerics = {
            ...generics,
            ...(isTypeValid && genericType && { ...scalarResults.generics, [genericType]: actualType })
        };

        return {
            valid: isTypeValid,
            type: isTypeValid ? originalType : actualType,
            generics: updatedGenerics,
            error: isTypeValid
                ? null
                : u.formatTypeMismatchMessage(expectedTypes, actualType, declaration, scalarResults.message)
        };
    };
}

export function produceValidationReport(validatorFn, types, values, generics = {}) {
    return types.reduce(
        (accum, type, index) => {
            const value = values[index];
            const report = validatorFn(type, value, accum.generics);
            return { reports: [...accum.reports, report], generics: { ...accum.generics, ...report.generics } };
        },
        { reports: [], generics }
    );
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
