export function formatTypeMismatchMessage(expectedType, actualType, declaration) {
    return `Expected ${expectedType} in \`${declaration}\` but received ${actualType}.`;
}

export function formatLengthMismatchMessage(expectedCount, actualCount, declaration) {
    return `Expected ${expectedCount} function parameters but received ${actualCount} in \`${declaration}\`.`;
}

export function getParameterType(parameter) {
    const nil = parameter == null;
    return nil ? 'void' : parameter.constructor.name;
}
