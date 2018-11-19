import { parseScalar } from '../scalar/utils.js';
import { isFunction, typeDeclaration } from '../utils.js';

export function formatTypeMismatchMessage(expectedTypes, actualType, declaration, message) {
    const value = `Expected ${expectedTypes.join(' or ')} in \`${declaration}\` declaration but received ${[]
        .concat(actualType)
        .join(' or ')}`;
    return message ? `${value} (${message}).` : `${value}.`;
}

export function formatLengthMismatchMessage(expectedCount, actualCount, declaration) {
    return `Expected ${expectedCount} function parameters but received ${actualCount} in \`${declaration}\`.`;
}

export function isScalar(type) {
    return Boolean(parseScalar(type));
}

export function getPrimitiveType(value) {
    const nil = value == null;
    return nil ? 'void' : value.constructor.name;
}

export function determineActualType(value) {
    const isArrayLike = Array.isArray(value);
    const isObjectLike = value instanceof Object && Object.keys(value).length > 0;
    const isFunctionLike = isFunction(value);

    if (isArrayLike) {
        const collection = value;
        const types = collection.map(determineActualType);
        return `Array(${Array.from(new Set(types)).join(', ')})`;
    }

    if (isObjectLike) {
        const model = value;
        const types = Object.entries(model).map(([key, value]) => `${key}: ${determineActualType(value)}`);
        return `${getPrimitiveType(value)}(${types.join(', ')})`;
    }

    if (isFunctionLike) {
        const fn = value;
        return `(${fn[typeDeclaration]})`;
    }

    return getPrimitiveType(value);
}
