import { splitTopLevel } from '../../parser/utils.js';

export default function validatePromise(validatorFn, ast, promise, generics) {
    const types = splitTopLevel(ast.declaration, '|');

    return new Promise(resolve => {
        return promise.then(value => resolve(validatorFn(types, value, generics)));
    });
}
