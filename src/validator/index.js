import * as u from './utils.js';
import { handleScalar } from '../scalar/index.js';

export function createValidator(ast, declaration) {
    return function validatorFn(types, value, generics = {}, actualType = u.getPrimitiveType(value)) {
        // Map each of the expected types by inspecting the generics and the defined aliases, otherwise the
        // type as it's passed is taken. We also determine the primitive type of the value, which may or may
        // not be a scalar type at this point.
        const expectedTypes = types.map(type => generics[type] || ast.aliases[type] || type);

        // Find the indices that match either the generic type or the concrete type, recursing when
        // a scalar is found by delegating to the correct scalar validator, if it exists.
        const matchedResults = expectedTypes.map(expectedType => {
            return u.isScalar(expectedType)
                ? handleScalar(validatorFn, expectedType, value, generics, actualType)
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
                : u.formatTypeMismatchMessage(
                      expectedTypes,
                      u.determineActualType(value),
                      declaration,
                      scalarResults.message
                  )
        };
    };
}

export function produceValidationReport(validatorFn, types, values, generics = {}) {
    const result = types.reduce(
        (accum, type, index) => {
            const value = values[index];
            const report = validatorFn(type, value, accum.generics);
            return { reports: [...accum.reports, report], generics: { ...accum.generics, ...report.generics } };
        },
        { reports: [], generics }
    );

    const firstInvalidReport = result.reports.find(report => !report.valid);
    const error = firstInvalidReport ? firstInvalidReport.error : null;

    return {
        valid: result.reports.every(report => report.valid),
        reports: result.reports,
        generics: result.generics,
        error
    };
}
