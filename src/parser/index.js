import * as u from './utils.js';

export function splitTypeDeclaration(declaration) {
    const { groups } = declaration.match(
        /((?<name>.+?)(?:∷|::))?((?:∀|forall)(?<generics>.+?)\.)?((?<aliases>.+?)(?:⇒|=>))?(?<types>.+)/iu
    );
    const name = !groups.name ? null : groups.name.trim();
    const aliases = !groups.aliases ? {} : parseAliases(groups.aliases);
    const generics = !groups.generics ? [] : parseGenerics(groups.generics);
    const types = parseTypes(groups.types, aliases);
    return { name, types, aliases, generics, declaration };
}

export function parseAliases(declaration) {
    return [...declaration.matchAll(/(.+?)(?:,|$)/gu)].reduce((aliases, [, mapping]) => {
        const [type, alias] = mapping.trim().split(' ');
        return { ...aliases, [alias]: type.trim() };
    }, {});
}

export function parseTypes(declaration, aliases = {}) {
    const initial = { groups: [], bracketCount: 0, inBrackets: false };
    return [...declaration.matchAll(/\s*(\(.+?\)|.+?)\s*(?:(?:→|->)|$)/gu)].reduce(
        (accum, [, type]) => u.balanceBrackets(accum, type, aliases),
        initial
    ).groups;
}

export function parseGenerics(declaration) {
    return declaration
        .trim()
        .split(' ')
        .map(a => a.trim());
}
