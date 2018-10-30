import validate from '../../validator/index.js';
import * as u from '../utils.js';

export default function handleArray(scalarType, ast, parameter, generics) {
    const initial = { generics };
    return u.yieldResult(
        parameter.reduce(
            (accum, parameter) => ({ ...accum, ...validate(ast, scalarType.description, [parameter], accum.generic) }),
            initial
        )
    );
}
