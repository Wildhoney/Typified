import { parseScalar } from '../scalar/utils.js';

export function formatTypeMismatchMessage(expectedTypes, actualType, declaration, message) {
    const value = `Expected ${expectedTypes.join(' or ')} in \`${declaration}\` declaration but received ${actualType}`;
    return message ? `${value} (${message}).` : `${value}.`;
}

export function formatLengthMismatchMessage(expectedCount, actualCount, declaration) {
    return `Expected ${expectedCount} function parameters but received ${actualCount} in \`${declaration}\`.`;
}

export function isScalar(type) {
    return Boolean(parseScalar(type));
}

export function getPrimitiveType(parameter) {
    const nil = parameter == null;
    return nil ? 'void' : parameter.constructor.name;
}

// export function getParameterType(ast, declarations, parameter, generics) {
//     const results = declarations.map(declaration => {
//         const scalar = getScalarAst(declaration);
//         const type = getPrimitiveType(parameter);
//         if (!scalar) return { type };
//         const f = scalars.get(scalar.type) || (() => ({ type }));
//         return f(ast, declaration, parameter, generics);
//     });
//     const result = results.find(({ isValid }) => isValid);
//     return result ? [result.type, result.generics, null] : [results[0].type, {}, results[0].feedback];
// }
