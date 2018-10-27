export function splitTypeDeclaration(declaration) {
    const { groups } = declaration.match(/((?:∀|forall)(?<generics>.+?)\.)?((?<aliases>.+?)(?:⇒|=>))?(?<types>.+)/iu);
    const aliases = !groups.aliases ? {} : parseAliases(groups.aliases);
    const generics = !groups.generics ? [] : parseGenerics(groups.generics);
    const types = parseTypes(groups.types, aliases);
    return { types, aliases, generics, declaration };
}

export function parseAliases(declaration) {
    return [...declaration.matchAll(/(.+?)(?:,|$)/gu)].reduce((aliases, [, mapping]) => {
        const [type, alias] = mapping.trim().split(' ');
        return { ...aliases, [alias]: type.trim() };
    }, {});
}

export function parseTypes(declaration, aliases = {}) {
    return [...declaration.matchAll(/\s*(\(.+?\)|.+?)\s*(?:(?:→|->)|$)/gu)].map(([, type]) =>
        type.split('|').map(type => (aliases[type.trim()] || type).trim())
    );
}

export function parseGenerics(declaration) {
    return declaration
        .trim()
        .split(' ')
        .map(a => a.trim());
}
