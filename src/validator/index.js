import * as prq from 'promisesque';
// import * as prq from 'https://cdn.jsdelivr.net/npm/promisesque@0.1.1/src/index.js';
import * as u from './utils.js';
import { validateScalar } from '../scalar/index.js';

export function createValidator(ast, declaration) {
    return function validatorFn(types, value, generics = {}) {
        // Map each of the expected types by inspecting the generics and the defined aliases, otherwise the
        // type as it's passed is taken. We also determine the primitive type of the value, which may or may
        // not be a scalar type at this point.
        const fGenerics = u.isType(value) ? generics[value.ref] || {} : {};
        const actualType = u.getType(value);
        const expectedTypes = u.getExpectedTypes(ast, types, generics, fGenerics);

        // Find the indices that match either the generic type or the concrete type, recursing when
        // a scalar is found by delegating to the correct scalar validator, if it exists.
        const matchedResults = expectedTypes.map(expectedType => {
            return u.isScalar(expectedType)
                ? validateScalar(validatorFn, expectedType, value, generics, ast.aliases)
                : { valid: expectedType === actualType };
        });

        return prq.all(matchedResults, matchedResults => {
            const matchedTypeIndex = matchedResults.findIndex(({ valid }) => valid);
            const genericTypeIndex = expectedTypes.findIndex(expectedType =>
                u.isType(value) && value.isGeneric()
                    ? !generics[value.ref] || !(expectedType in generics[value.ref])
                    : ast.generics.includes(expectedType) && !(expectedType in generics)
            );

            // Resolved the above indices to actual types, either concrete or generic. Also find the `originalType`
            // which is the type that matched from the types past to the function initially.
            const matchedType = expectedTypes[matchedTypeIndex];
            const genericType = !matchedType && expectedTypes[genericTypeIndex];
            const originalType = types[genericTypeIndex] || types[matchedTypeIndex];

            // If we have a matched type then take the generics and the message from that result.
            const scalarResults = matchedResults[matchedTypeIndex] || {};

            // Determine if the type is valid and update the generics if the type is indeed valid.
            const isTypeValid = Boolean(matchedType || genericType);
            const updatedGenerics = u.mergeGenerics(
                generics,
                isTypeValid,
                genericType,
                scalarResults,
                value,
                actualType
            );

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
        });
    };
}

export function produceValidationReport(validatorFn, types, values, generics = {}) {
    const result = types.reduce(
        (accum, type, index) => {
            const value = values[index];
            const report = validatorFn(type, value, accum.generics);
            return prq.create(report, report =>( { reports: [...accum.reports, report], generics: { ...accum.generics, ...report.generics } }) )
        },
        { reports: [], generics }
    );

    return prq.create(result, result => {

        const firstInvalidReport = result.reports.find(report => !report.valid);
        const error = firstInvalidReport ? firstInvalidReport.error : null;
    
        return {
            valid: result.reports.every(report => report.valid),
            reports: result.reports,
            generics: result.generics,
            error
        };

    })
}
