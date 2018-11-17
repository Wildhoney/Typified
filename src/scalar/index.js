import handleArray from './array/index.js';
import handleObject from './object/index.js';
import handleFunction from './function/index.js';
import * as u from './utils.js';

const handlers = new Map(
    Object.entries({
        Array: handleArray,
        Object: handleObject,
        Function: handleFunction
    })
);

export function addScalarValidator(type, fn) {
    handlers.set(type, fn);
}

export function handleScalar(validatorFn, declaration, value, generics) {
    const ast = u.parseScalar(declaration);
    const f = handlers.get(ast.type ? ast.type : 'Function');
    return f(validatorFn, ast, value, generics);
}
