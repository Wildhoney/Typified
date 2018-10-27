export const isFunction = a => typeof a === 'function';

export function concatTemplate(types, expressions) {
    return types
        .map((type, index) => {
            const expression = expressions[index];
            return `${type} ${expression ? expression : ''}`;
        })
        .join('')
        .trim();
}
