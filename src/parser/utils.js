export function getScalarAst(declaration) {
    const r = /^(?<type>.+?)\((?<description>.+?)\)$/i;
    const isScalar = r.test(declaration);
    return isScalar ? declaration.match(r).groups : null;
}

export function balanceBrackets(accum, type, aliases) {
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
                    splitTopLevel(type.trim(), '|').map(type => (aliases[type.trim()] || type).trim())
                ]
            };
    }
}

export function splitTopLevel(value, character) {
    const letters = value.split('');

    return letters.reduce(
        (accum, letter, index) => {
            const end = letters.length - 1 === index;
            const depth = calculateDepth(letter, accum);
            const split = (letter === character && depth === 0) || end;

            const segments = split ? [...accum.segments, accum.current.trim() + (end ? letter : '')] : accum.segments;
            const current = split ? '' : `${accum.current}${letter}`;

            return { ...accum, segments, depth, current };
        },
        { segments: [], depth: 0, current: '' }
    ).segments;
}

function calculateDepth(letter, accum) {
    return letter === '(' ? accum.depth + 1 : letter === ')' ? accum.depth - 1 : accum.depth;
}

function getBracketCounts(type) {
    return {
        open: (type.match(/\(/g) || []).length,
        close: (type.match(/\)/g) || []).length
    };
}
