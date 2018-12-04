import validateArray from './array/index.js';
import validateObject from './object/index.js';
import validateFunction from './function/index.js';
import validatePromise from './promise/index.js';
import { parseScalar } from '../parser/utils.js';

const handlers = new Map(
    Object.entries({
        Array: validateArray,
        Object: validateObject,
        Function: validateFunction,
        ƒ: validateFunction,
        Promise: validatePromise
    })
);

export function addScalarValidator(type, fn) {
    handlers.set(type, fn);
}

export function validateScalar(validatorFn, declaration, value, generics) {
    const ast = parseScalar(declaration);
    const isFunction = !ast.type;
    const fn = handlers.get(!isFunction ? ast.type : 'Function');
    return fn(validatorFn, ast, value, generics);
}
