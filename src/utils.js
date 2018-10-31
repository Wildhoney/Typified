export const typeDeclaration = Symbol('@typified/type-declaration');

export const isFunction = a => typeof a === 'function';

export function concatTemplate(types, expressions) {
    return types
        .map((type, index) => {
            const expression = expressions[index];
            return `${type} ${expression || ''}`;
        })
        .join('')
        .trim();
}

export class TypeMismatchError extends Error {}

export class LengthMismatchError extends Error {}
