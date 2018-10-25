import test from 'ava';
import * as g from './index.js';
import typeDeclarations from '../../../tests/helpers/types-declarations.js';

test('It should be able to parse type strings into aliases, generics and types;', t =>
    typeDeclarations.forEach(({ type, ast }) => t.deepEqual(g.parseTypeDeclaration(type), ast)));

test('It should be able to determine a function type;', t => {
    t.false(g.isFunction(1));
    t.false(g.isFunction('Example'));
    t.true(g.isFunction(() => {}));
    t.true(g.isFunction(function() {}));
});

test('It should be able to setup the default AST;', t => {
    t.deepEqual(g.defaults, {
        generics: null,
        aliases: null,
        types: null
    });
});

test('It should be able to trim and merge the object;', t => {
    const model = { name: 'Adam', age: 33 };
    const mergedModel = g.trimMerge(model, ['location', ' Bushey ']);
    const mergedNullModel = g.trimMerge(model, ['location', undefined]);
    t.deepEqual(mergedModel, { ...model, location: 'Bushey' });
    t.deepEqual(mergedNullModel, { ...model, location: null });
});

test('It should be able to construct an alias map;', t => {
    const aliases = 'String s, Number n, Array a'.split(',').map(g.trim);
    t.deepEqual(g.createAliasMap(aliases), {
        s: 'String',
        n: 'Number',
        a: 'Array'
    });
});

test('It should be able to throw type errors;', t => {
    t.throws(
        () => g.throwTypeError('Number', 'String'),
        `Expected "Number" for sayHello but received "String".`
    );
});

test('It should be able to determine if a type is a scalar type;', t => {
    t.true(g.isScalar('Array(String)'));
    t.true(g.isScalar('Promise(void)'));
    t.true(g.isScalar('Object(name: String)'));
    t.false(g.isScalar('String'));
    t.false(g.isScalar('Array'));
    t.false(g.isScalar('Boolean'));
});

test('It should be able to parse scalar types', t => {
    t.deepEqual(g.parseScalar('Array(String)'), {
        type: 'Array',
        description: 'String'
    });
    t.deepEqual(g.parseScalar('Array(Array(Number))'), {
        type: 'Array',
        description: 'Array(Number)'
    });
    t.deepEqual(g.parseScalar('Promise(Object(name: String))'), {
        type: 'Promise',
        description: 'Object(name: String)'
    });
});

test('It should be able to determine the types of values;', t => {
    t.is(g.determineType('Adam'), 'String');
    t.is(g.determineType([]), 'Array');
    t.is(g.determineType({ name: 'Adam' }), 'Object');
    t.is(g.determineType(new Date()), 'Date');
    t.is(g.determineType(new Promise(() => {})), 'Promise');
    t.is(g.determineType(global.BigInt(5)), 'BigInt');
    t.is(g.determineType(new Uint16Array()), 'Uint16Array');
    t.is(g.determineType(undefined), 'void');
    t.is(g.determineType(null), 'void');
});
