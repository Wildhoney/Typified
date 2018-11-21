import { typeDeclaration } from '../utils.js';
import { splitTypeDeclaration } from '../parser/index.js';
import { Type } from '../validator/utils';
import validateArray from './array/index.js';
import validateObject from './object/index.js';
import validateFunction from './function/index.js';
import * as u from './utils.js';

const handlers = new Map(
    Object.entries({
        Array: validateArray,
        Object: validateObject,
        Function: validateFunction
    })
);

export function addScalarValidator(type, fn) {
    handlers.set(type, fn);
}

export function validateScalar(validatorFn, declaration, value, generics) {
    const ast = u.parseScalar(declaration);
    const isFunction = !ast.type;
    const fn = handlers.get(!isFunction ? ast.type : 'Function');

    if (isFunction) {
        const hasTypeDeclaration = typeDeclaration in value;
        if (!hasTypeDeclaration) {
            return { valid: true };
        }
        const ast = splitTypeDeclaration(value[typeDeclaration]);
        const typeValidatorFn = (types, type, generics) => {
            return validatorFn(types, new Type(type), generics);
        };
        return fn(typeValidatorFn, ast, ast.types, {});
    }

    return fn(validatorFn, ast, value, generics);
}
