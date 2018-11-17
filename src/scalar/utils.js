export function parseScalar(declaration) {
    const r = /^(?<type>.+?)\((?<declaration>.+?)\)$/i;
    const isScalar = r.test(declaration);
    return isScalar ? declaration.match(r).groups : null;
}
