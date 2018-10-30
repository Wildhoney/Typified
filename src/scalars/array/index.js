import * as parser from '../../parser/index.js';
import validate from '../../validator/index.js';

export default function handleArray(scalarType, parameter, generics) {
    const initial = { generics };
    const ast = parser.splitTypeDeclaration(scalarType.description);
    const result = parameter.reduce(
        (accum, parameter) => validate(ast, scalarType.description, [parameter], accum.generic),
        initial
    );
    return { valid: result.errors.length === 0, generics: result.generics };
}
