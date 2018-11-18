import { validateArray } from './array/index.js';
import { validateObject } from './object/index.js';
import * as u from './utils.js';

const handlers = new Map(
    Object.entries({
        Array: { validate: validateArray },
        Object: { validate: validateObject }
        // Function: handleFunction
    })
);

export function addScalarValidator(type, fn) {
    handlers.set(type, fn);
}

export function validateValue(validatorFn, declaration, value, generics) {
    const ast = u.parseScalar(declaration);
    const f = handlers.get(ast.type ? ast.type : 'Function');
    return f.validate(validatorFn, ast, value, generics);
}
