import { splitTopLevel, parseScalar } from '../../parser/utils.js';
import { isType } from '../../validator/utils.js';

export default function validatePromise(validatorFn, ast, promise, generics) {
    const types = splitTopLevel(ast.description, '|');

    if (isType(promise)) {
        const type = promise;
        const { description } = parseScalar(type.is);
        return validatorFn(types, type.set(description), generics);
    }

    return new Promise(resolve => {
        return promise.then(value => resolve(validatorFn(types, value, generics)));
    });
}
