import * as u from './utils.js';
import { validateValue, validateType } from '../scalar/index.js';

export const contexts = { VALUE: Symbol('typified/value'), TYPE: Symbol('typified/type') };

export function createValidator(context, ast, declaration) {
    switch (context) {
        case contexts.VALUE:
            return createValueValidator(ast, declaration);
        case contexts.TYPE:
            return createTypeValidator(ast, declaration);
    }
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

function createValueValidator(ast, declaration) {
    return function validatorFn(types, value, generics = {}) {
        // Map each of the expected types by inspecting the generics and the defined aliases, otherwise the
        // type as it's passed is taken. We also determine the primitive type of the value, which may or may
        // not be a scalar type at this point.
        const actualType = u.getPrimitiveType(value);
        const expectedTypes = types.map(type => generics[type] || ast.aliases[type] || type);

        // Find the indices that match either the generic type or the concrete type, recursing when
        // a scalar is found by delegating to the correct scalar validator, if it exists.
        const matchedResults = expectedTypes.map(expectedType => {
            return u.isScalar(expectedType)
                ? validateValue(validatorFn, expectedType, value, generics)
                : { valid: expectedType === actualType };
        });
        const matchedTypeIndex = matchedResults.findIndex(({ valid }) => valid);
        const genericTypeIndex = expectedTypes.findIndex(
            expectedType => ast.generics.includes(expectedType) && !(expectedType in generics)
        );

        // Resolved the above indices to actual types, either concrete or generic. Also find the `originalType`
        // which is the type that matched from the types past to the function initially.
        const matchedType = expectedTypes[matchedTypeIndex];
        const genericType = expectedTypes[genericTypeIndex];
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

function createTypeValidator([sourceAst, targetAst], declaration) {
    return function validatorFn(sourceType, targetTypes, generics = {}) {
        const sourceTypes = [].concat(sourceType);
        const matchedResults = sourceTypes.map(type => {
            const sourceType = generics[type] || sourceAst.aliases[type] || type;
            return u.isScalar(sourceType)
                ? validateType(validatorFn, targetTypes, sourceType, generics)
                : { valid: targetTypes.includes(sourceType) };
        });
        const matchedTypeIndex = matchedResults.findIndex(({ valid }) => valid);
        const genericTypeIndex = targetTypes.findIndex(
            type => targetAst.generics.includes(type) && !(type in generics)
        );

        const matchedType = sourceTypes[matchedTypeIndex];
        const genericType = targetTypes[genericTypeIndex];

        const isTypeValid = Boolean(matchedType || genericType);

        const updatedGenerics = {
            ...generics,
            ...(isTypeValid &&
                genericType && { ...matchedResults.generics, [genericType]: sourceTypes[genericTypeIndex] })
        };

        return {
            valid: isTypeValid,
            generics: updatedGenerics,
            error: isTypeValid
                ? null
                : u.formatTypeMismatchMessage(sourceTypes, targetTypes, declaration, matchedResults.message)
        };
    };
}
