import * as parser from '../parser/index.js';
import handleArray from './array/index.js';
import handleFunction from './function/index.js';

const defaults = {
    Array: handleArray,
    ƒ: handleFunction
};

export const validators = new Map(Object.entries(defaults));

function parse(scalarType, newAst, ...args) {
    const f = validators.get(scalarType.type) || (() => ({ valid: false }));
    return f(scalarType, newAst, ...args);
}

export function validate(scalarType, ast, ...args) {
    const newAst = { ...parser.splitTypeDeclaration(scalarType.description), generics: ast.generics };
    return {
        matchedType: `${scalarType.type}(${scalarType.description})`,
        ...parse(scalarType, newAst, ...args)
    };
}
