import scalars from './scalars/index.js'

export function formatTypeMismatchMessage(expectedType, actualType, declaration) {
    return `Expected ${expectedType} in \`${declaration}\` but received ${actualType}.`;
}

export function formatLengthMismatchMessage(expectedCount, actualCount, declaration) {
    return `Expected ${expectedCount} function parameters but received ${actualCount} in \`${declaration}\`.`;
}

export function getScalarAst(declaration) {
    const r = /^(?<type>.+?)\((?<declaration>.+?)\)$/i;
    const isScalar = r.test(declaration);
    return isScalar ? declaration.match(r).groups : null;
}

export function getPrimitiveType(parameter) {
    const nil = parameter == null;
    return nil ? 'void' : parameter.constructor.name;
}

export function getParameterType(ast, declarations, parameter, generics) {
    const results = declarations.map(declaration => {
        const scalar = getScalarAst(declaration);
        const type = getPrimitiveType(parameter)
        if (!scalar) return { type };
        const f = scalars.get(scalar.type) || (() => ({type}));
        return f(ast, declaration, parameter, generics);
    });
    const result = results.find(({ isValid }) => isValid);
    return result ? [result.type, result.generics] : [results[0].type, {}];
}

