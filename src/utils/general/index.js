export const typeArrows = /->|→/;

const scalarType = /^(?<type>.+?)\((?<description>.+?)\)$/i;

export const defaults = { generics: null, aliases: null, types: null };

class TypeError extends Error {}

const matches = {
    generics: `(?:(?:∀|forall)(?<generics>.+?)\\.)?`,
    aliases: `(?:(?<aliases>.+?)(?:=>|⇒))?`,
    types: `(?<types>.+)`
};

export const trim = a => a.trim();

export const isFunction = a => typeof a === 'function';

export const prettifyExpected = type => [].concat(type).join(' | ');

export const parseTypeDeclaration = type => {
    const expression = new RegExp(`${matches.generics}${matches.aliases}${matches.types}`, 'i');
    const match = Object.entries(type.match(expression).groups).reduce(trimMerge, defaults);
    const aliasMap = match.aliases && createAliasMap(match.aliases.split(',').map(trim));

    const types = match.types
        .split(typeArrows)
        .map(trim)
        .map(types =>
            types
                .split('|')
                .map(trim)
                .map(type => (aliasMap ? aliasMap[type] || type : type))
        );
    const generics = match.generics ? match.generics.split(' ').map(trim) : [];
    const aliases = aliasMap || {};
    return { types, generics, aliases, declaration: type.trim() };
};

export const trimMerge = (model, [key, value]) => ({
    ...model,
    [key]: value ? value.trim() : null
});

export const createAliasMap = aliases =>
    aliases.reduce((map, aliasDefinition) => {
        const [type, alias] = aliasDefinition.split(' ');
        return { ...map, [alias]: type };
    }, {});

export const throwTypeMismatchError = (expected, actual, declaration) => {
    throw new TypeError(`Expected ${expected} in \`${declaration}\` but received ${actual}.`);
};

export const throwTypeLengthError = (expected, actual, declaration) => {
    throw new TypeError(
        `Expected ${expected} function parameters but received ${actual} in \`${declaration}\`.`
    );
};

export const isScalar = type => scalarType.test(type);

export const parseScalar = type => type.match(scalarType).groups;

export const determineType = value => {
    const nil = value == null;
    return nil ? 'void' : value.constructor.name;
};
