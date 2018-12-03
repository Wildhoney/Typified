export const typeDeclaration = Symbol('@typified/type-declaration');

export function isFunction(a) {
    return typeof a === 'function';
}

export function concatTemplate(types, expressions) {
    return types
        .map((type, index) => {
            const expression = expressions[index];
            return `${type} ${expression || ''}`;
        })
        .join('')
        .trim();
}

export function checkReport(report) {
    !report.valid &&
        (error => {
            throw new TypeMismatchError(error);
        })(report.error);
}

export class TypeMismatchError extends Error {}

export class LengthMismatchError extends Error {}
