import { typeDeclaration } from '../utils.js';
import { splitTypeDeclaration } from '../parser/index.js';
import { createValidator } from '../validator/index.js';
import { Type } from '../validator/utils.js';
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

export function validateScalar(validatorFn, declaration, value, generics, aliases) {
    const ast = u.parseScalar(declaration);
    const isFunction = !ast.type;
    const fn = handlers.get(!isFunction ? ast.type : 'Function');

    if (isFunction) {
        const functionDeclaration = value[typeDeclaration];
        if (!functionDeclaration) {
            return { valid: true };
        }
        const functionAst = splitTypeDeclaration(functionDeclaration);
        const validator = createValidator(functionAst, functionDeclaration);
        const fValidatorFn = (types, type, generics) => {
            const newType = new Type(aliases[type.is] || type.is);
            return validator(types, newType, generics);
        };
        return fn(fValidatorFn, ast, functionAst.types, {});
    }

    return fn(validatorFn, ast, value, generics);
}
