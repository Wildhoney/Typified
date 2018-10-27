export function maybeParseScalar(declaration) {
    const r = /^(?<type>.+?)\((?<description>.+?)\)$/i;
    const isScalar = r.test(declaration);
    return isScalar ? declaration.match(r).groups : null;
}
