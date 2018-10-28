export function maybeParseScalar(declaration) {
    const r = /^(?<type>.+?)\((?<description>.+?)\)$/i;
    const isScalar = r.test(declaration);
    return isScalar ? declaration.match(r).groups : null;
}

export function balanceBrackets(type, accum, aliases) {
    const counts = getBracketCounts(type);
    const bracketCount = accum.bracketCount + counts.open - counts.close;
    const newAccum = { ...accum, bracketCount, inBrackets: bracketCount !== 0 };

    switch (accum.inBrackets) {
        case true:
            const lastGroup = accum.groups[accum.groups.length - 1];
            const lastItem = lastGroup[lastGroup.length - 1];
            const item = `${lastItem.trim()} -> ${type.trim()}`;
            return { ...newAccum, groups: [...accum.groups.slice(0, accum.groups.length - 1), [item]] };
        case false:
            return {
                ...newAccum,
                groups: [
                    ...accum.groups,
                    type
                        .trim()
                        .split('|')
                        .map(type => (aliases[type.trim()] || type).trim())
                ]
            };
    }
}

function getBracketCounts(type) {
    return {
        open: (type.match(/\(/g) || []).length,
        close: (type.match(/\)/g) || []).length
    };
}
