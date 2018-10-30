import * as parser from '../../parser/index.js';
import validate from '../../validator/index.js';
import * as u from '../utils.js';

export default function handleArray(scalarType, parameter, generics) {
    const initial = { generics };
    const ast = parser.splitTypeDeclaration(scalarType.description);
    return u.yieldResult(
        parameter.reduce(
            (accum, parameter) => ({ ...accum, ...validate(ast, scalarType.description, [parameter], accum.generic) }),
            initial
        )
    );
}
