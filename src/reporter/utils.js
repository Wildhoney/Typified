export const errorTypes = {
    TYPE_MISMATCH: Symbol('type-mismatch'),
    LENGTH_MISMATCH: Symbol('length-mismatch')
};

function colouredTypes(types, position) {
    return {
        types: `%c${types.join('%c → %c')}%c`,
        styles: types.flatMap((_, index) => [
            index === position ? 'color: deeppink; font-weight: bold; text-decoration: underline' : 'color: deeppink',
            '#656d78'
        ])
    };
}

export function throwPrettyError(type, ast, report) {
    switch (type) {
        case errorTypes.TYPE_MISMATCH:
            const colouring = colouredTypes(ast.types, report.position);

            console.trace(
                `%cTypified%c:\n\n%c Expected ${colouring.types} %cin %cgetName %cbut received %c${
                    report.error.actual
                }\n`,
                'color: #656d78; font-weight: bold; text-decoration: underline',
                'color: #656d78',
                'color: #656d78',
                ...colouring.styles,
                'color: #656d78',
                'color: green; font-weight: bold',
                'color: #656d78',
                'color: deeppink; font-weight: bold'
            );

            throw formatTypeMismatchMessage(
                report.error.expected,
                report.error.actual,
                ast.declaration,
                report.error.message
            );
    }
}

export function getInputTypes(types) {
    return types.slice(0, types.length - 1);
}

export function getOutputTypes(types) {
    return types.slice(types.length - 1);
}

export function formatTypeMismatchMessage(expectedTypes, actualType, declaration, message) {
    const value = `Expected ${expectedTypes.join(' or ')} in \`${declaration}\` declaration but received ${[]
        .concat(actualType)
        .join(' or ')}`;
    return message ? `${value} (${message}).` : `${value}.`;
}

function pluralise(word, count) {
    return count === 1 ? word : `${word}s`;
}

export function formatLengthMismatchMessage(expectedCount, actualCount, declaration) {
    return `Expected ${expectedCount} function ${pluralise(
        'parameter',
        expectedCount
    )} but received ${actualCount} ${pluralise('parameter', actualCount)} in \`${declaration}\`.`;
}
