import test from 'ava';
import * as ast from '../index.js';

test('It should be able to able to parse the declaration using simple types;', t => {
    // Most simple example using only the same concrete types.
    const first = 'String -> String';
    t.deepEqual(ast.splitTypeDeclaration(first), {
        types: [['String'], ['String']],
        generics: [],
        aliases: {},
        declaration: first
    });

    // Mixing up the concrete types, but still simple.
    const second = 'Number -> String -> Boolean';
    t.deepEqual(ast.splitTypeDeclaration(second), {
        types: [['Number'], ['String'], ['Boolean']],
        generics: [],
        aliases: {},
        declaration: second
    });

    // Adding a non-primitive (scalar) type into the mix.
    const third = 'Date -> Array(Promise) -> Array(Boolean)';
    t.deepEqual(ast.splitTypeDeclaration(third), {
        types: [['Date'], ['Array(Promise)'], ['Array(Boolean)']],
        generics: [],
        aliases: {},
        declaration: third
    });

    // Adding a function declaration into the type.
    const fourth = 'Date -> (String -> String -> Array(Number)) -> Array(Promise)';
    t.deepEqual(ast.splitTypeDeclaration(fourth), {
        types: [['Date'], ['(String -> String -> Array(Number))'], ['Array(Promise)']],
        generics: [],
        aliases: {},
        declaration: fourth
    });

    // Introducing a union on a primitive type.
    const fifth = 'Date -> String|Number -> Array(String)';
    t.deepEqual(ast.splitTypeDeclaration(fifth), {
        types: [['Date'], ['String', 'Number'], ['Array(String)']],
        generics: [],
        aliases: {},
        declaration: fifth
    });

    // Introducing a union on a non-primitive (scalar) type.
    const sixth = 'Date -> Array(String)|Array(Number) -> Array(String)';
    t.deepEqual(ast.splitTypeDeclaration(sixth), {
        types: [['Date'], ['Array(String)', 'Array(Number)'], ['Array(String)']],
        generics: [],
        aliases: {},
        declaration: sixth
    });

    // Introducing a union on a function type.
    const seventh = 'a -> (a -> b)|(a -> c) -> b|c';
    t.deepEqual(ast.splitTypeDeclaration(seventh), {
        types: [['a'], ['(a -> b)', '(a -> c)'], ['b', 'c']],
        generics: [],
        aliases: {},
        declaration: seventh
    });
});

test('It should be able to parse the declaration with aliases introduced;', t => {
    // The simplest declaration using a single alias.
    const first = 'String s => s -> s';
    t.deepEqual(ast.splitTypeDeclaration(first), {
        types: [['String'], ['String']],
        generics: [],
        aliases: { s: 'String' },
        declaration: first
    });
});

test('It should be able to parse the declaration with generics introduced;', t => {
    // The simplest declaration using a two generic types.
    const first = 'forall a b. String s => s -> a -> b';
    t.deepEqual(ast.splitTypeDeclaration(first), {
        types: [['String'], ['a'], ['b']],
        generics: ['a', 'b'],
        aliases: { s: 'String' },
        declaration: first
    });

    // Adding function declaration using generics into the mix.
    const second = 'forall a b c. a -> b -> (a -> b -> c)';
    t.deepEqual(ast.splitTypeDeclaration(second), {
        types: [['a'], ['b'], ['(a -> b -> c)']],
        generics: ['a', 'b', 'c'],
        aliases: {},
        declaration: second
    });
});
