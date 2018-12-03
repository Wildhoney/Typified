export default function validatePromise(validatorFn, ast, promise, generics) {
    return new Promise(resolve => {
        return resolve({ valid: true });
    });
}
