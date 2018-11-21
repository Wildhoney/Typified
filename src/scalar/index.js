import * as array from './array/index.js';
import * as object from './object/index.js';
import * as u from './utils.js';

const handlers = new Map(
    Object.entries({
        Array: { value: array.isValueValid, type: array.isTypeValid },
        Object: { value: object.isValueValid,type:object.isTypeValid }
        // Function: handleFunction
    })
);

export function addScalarValidator(type, fn) {
    handlers.set(type, fn);
}

export function validateValue(validatorFn, declaration, value, generics) {
    const ast = u.parseScalar(declaration);
    const f = handlers.get(ast.type ? ast.type : 'Function');
    return f.value(validatorFn, ast, value, generics);
}

export function validateType(validatorFn, targetTypes, sourceType, generics) {
    const sourceAst = u.parseScalar(sourceType);
    const targetAsts = targetTypes.map(type => u.parseScalar(type).declaration);
    const f = handlers.get(sourceAst.type ? sourceAst.type : 'Function');
    return f.type(validatorFn, targetAsts, sourceAst.declaration, generics);
}
