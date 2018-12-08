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
