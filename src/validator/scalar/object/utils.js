import { splitTopLevel } from '../../../parser/utils.js';

export function getTypeMap(declaration) {
    return splitTopLevel(declaration, ',').reduce((accum, declaration) => {
        const type = declaration.trim();
        const { groups } = type.match(/(?<key>.+?):(?<value>.+)/i);
        return { ...accum, [groups.key.trim()]: groups.value.trim() };
    }, {});
}
