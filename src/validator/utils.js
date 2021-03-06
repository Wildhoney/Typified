import { parseScalar } from '../parser/utils.js';
import { isFunction, typeDeclaration } from '../utils.js';

export class Type {
    constructor(type, ast, ref = Symbol(ast.types.join(' → '))) {
        this.is = type;
        this.ast = ast;
        this.ref = ref;
    }
    set(type) {
        return new Type(type, this.ast, this.ref);
    }
    get() {
        return this.ast.aliases[this.is] || this.is;
    }
    isGeneric() {
        return this.ast.generics.includes(this.is);
    }
}

export const isType = type => type instanceof Type;

export function getType(value) {
    if (isType(value)) {
        return value.get();
    }
    const nil = value == null;
    return nil ? 'void' : value.constructor.name;
}

export function isScalar(type) {
    return Boolean(parseScalar(type));
}

export function determineActualType(value) {
    const isArrayLike = Array.isArray(value);
    const isObjectLike = value instanceof Object && Object.keys(value).length > 0;
    const isFunctionLike = isFunction(value);
    const isPromiseLike = value instanceof Promise;

    switch (true) {
        case isArrayLike: {
            const collection = value;
            const types = collection.map(determineActualType);
            return `Array(${Array.from(new Set(types)).join(', ')})`;
        }

        case isPromiseLike: {
            const promise = value;
            return promise.then(value => `Promise(${determineActualType(value)})`);
        }

        case isObjectLike: {
            const model = value;
            const types = Object.entries(model).map(([key, value]) => `${key}: ${determineActualType(value)}`);
            return `${getType(value)}(${types.join(', ')})`;
        }

        case isFunctionLike: {
            const fn = value;
            return `(${fn[typeDeclaration]})`;
        }

        default:
            return getType(value);
    }
}

export function getExpectedTypes(ast, types, generics, fGenerics) {
    return types.map(
        type => generics[type] || ast.aliases[type] || Object.keys(fGenerics).find(k => fGenerics[k] === type) || type
    );
}

export function mergeGenerics(generics, isTypeValid, genericType, scalarResults, value, actualType) {
    return {
        ...generics,
        ...(isTypeValid &&
            genericType && {
                ...scalarResults.generics,
                ...(isType(value) || (isType(value) && value.isGeneric())
                    ? { [value.ref]: { ...generics[value.ref], [actualType]: genericType } }
                    : { [genericType]: actualType })
            })
    };
}
