export const typeArrows = /->|→/;

class TypeError extends Error {}

const matches = {
    generics: `(?:∀|forall(?<generics>.+?)\\.)?`,
    aliases: `(?:(?<aliases>.+?)(?:=>|⇒))?`,
    types: `(?<types>.+)`
};

export const isFunction = a => typeof a === 'function';

export const defaults = { generics: null, aliases: null, types: null };

const trimMerge = (model, [key, value]) => ({
    ...model,
    [key]: value ? value.trim() : null
});

const createAliasMap = aliases =>
    aliases.reduce((map, aliasDefinition) => {
        const [type, alias] = aliasDefinition.split(' ');
        return { ...map, [alias]: type };
    }, {});

export const trim = a => a.trim();

export const parseType = type => {
    const expression = new RegExp(
        `${matches.generics}${matches.aliases}${matches.types}`,
        'i'
    );
    const match = Object.entries(type.match(expression).groups).reduce(
        trimMerge,
        defaults
    );
    const aliasMap =
        match.aliases && createAliasMap(match.aliases.split(',').map(trim));
    const types = match.types
        .split(typeArrows)
        .map(trim)
        .map(type => aliasMap[type] || type);
    return { types, generics: match.generics.split(' ').map(trim) };
};

export const throwTypeError = (expectedType, actualType) => {
    throw new TypeError(
        `Expected "${expectedType}" for sayHello but received "${actualType}".`
    );
};
