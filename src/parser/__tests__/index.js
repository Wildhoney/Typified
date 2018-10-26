import test from 'ava';
import * as parser from '../index.js';

test('It should be able to able to parse the declaration using same concrete types;', t => {
    const declaration = 'String -> String';
    t.deepEqual(parser.splitTypeDeclaration(declaration), {
        types: [['String'], ['String']],
        generics: [],
        aliases: {},
        declaration
    });
});

test('It should be able to able to parse the declaration using dissimilar concrete types;', t => {
    const declaration = 'Number -> String -> Boolean';
    t.deepEqual(parser.splitTypeDeclaration(declaration), {
        types: [['Number'], ['String'], ['Boolean']],
        generics: [],
        aliases: {},
        declaration
    });
});

test('It should be able to able to parse the declaration with introduction of scalar types;', t => {
    const declaration = 'Date -> Array(Promise) -> Array(Boolean)';
    t.deepEqual(parser.splitTypeDeclaration(declaration), {
        types: [['Date'], ['Array(Promise)'], ['Array(Boolean)']],
        generics: [],
        aliases: {},
        declaration: declaration
    });
});
test('It should be able to able to parse the declaration with a function type introduced;', t => {
    const declaration = 'Date -> (String -> String -> Array(Number)) -> Array(Promise)';
    t.deepEqual(parser.splitTypeDeclaration(declaration), {
        types: [['Date'], ['(String -> String -> Array(Number))'], ['Array(Promise)']],
        generics: [],
        aliases: {},
        declaration
    });
});
test('It should be able to able to parse the declaration which has type unions;', t => {
    // Introducing a union on a primitive type.
    const declaration = 'Date -> String|Number -> Array(String)';
    t.deepEqual(parser.splitTypeDeclaration(declaration), {
        types: [['Date'], ['String', 'Number'], ['Array(String)']],
        generics: [],
        aliases: {},
        declaration
    });
});
test('It should be able to able to parse the declaration using scalar union types;', t => {
    const declaration = 'Date -> Array(String)|Array(Number) -> Array(String)';
    t.deepEqual(parser.splitTypeDeclaration(declaration), {
        types: [['Date'], ['Array(String)', 'Array(Number)'], ['Array(String)']],
        generics: [],
        aliases: {},
        declaration
    });
});

test('It should be able to able to parse the declaration using function union types;', t => {
    const declaration = 'a -> (a -> b)|(a -> c) -> b|c';
    t.deepEqual(parser.splitTypeDeclaration(declaration), {
        types: [['a'], ['(a -> b)', '(a -> c)'], ['b', 'c']],
        generics: [],
        aliases: {},
        declaration
    });
});

test('It should be able to parse the declaration with a single alias;', t => {
    const declaration = 'String s => s -> s';
    t.deepEqual(parser.splitTypeDeclaration(declaration), {
        types: [['String'], ['String']],
        generics: [],
        aliases: { s: 'String' },
        declaration
    });
});
test('It should be able to parse the declaration with multiple aliases;', t => {
    const declaration = 'String s, Number n, Date d => s -> n -> Boolean -> d';
    t.deepEqual(parser.splitTypeDeclaration(declaration), {
        types: [['String'], ['Number'], ['Boolean'], ['Date']],
        generics: [],
        aliases: { s: 'String', n: 'Number', d: 'Date' },
        declaration
    });
});

test('It should be able to parse the declaration with two generic types added;', t => {
    const declaration = 'forall a b. String s => s -> a -> b';
    t.deepEqual(parser.splitTypeDeclaration(declaration), {
        types: [['String'], ['a'], ['b']],
        generics: ['a', 'b'],
        aliases: { s: 'String' },
        declaration
    });
});

test('It should be able to parse the declaration with a handful of generic types', t => {
    const declaration = 'forall a b c. a -> b -> (a -> b -> c)';
    t.deepEqual(parser.splitTypeDeclaration(declaration), {
        types: [['a'], ['b'], ['(a -> b -> c)']],
        generics: ['a', 'b', 'c'],
        aliases: {},
        declaration
    });
});