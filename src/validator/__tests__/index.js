import test from 'ava';
import * as parser from '../../parser/index.js';
import defineType from '../../index.js';
import { createValidator } from '../index.js';

test('It should be able to validate declarations with concrete types;', t => {
    const declaration = 'String|Number';
    const ast = parser.splitTypeDeclaration(declaration);
    const validate = createValidator(ast, declaration);
    const expectedTypes = ast.types[0];
    t.deepEqual(validate(expectedTypes, 'Adam'), {
        valid: true,
        type: 'String',
        generics: {},
        error: null
    });
    t.deepEqual(validate(expectedTypes, 42), {
        valid: true,
        type: 'Number',
        generics: {},
        error: null
    });
    t.deepEqual(validate(expectedTypes, new Date()), {
        valid: false,
        type: 'Date',
        generics: {},
        error: `Expected String or Number in \`${declaration}\` declaration but received Date.`
    });
});

test('It should be able to validate declarations with alias types;', t => {
    const declaration = 'String s, Number n => s|n';
    const ast = parser.splitTypeDeclaration(declaration);
    const validate = createValidator(ast, declaration);
    const expectedTypes = ast.types[0];
    t.deepEqual(validate(expectedTypes, 'Adam'), {
        valid: true,
        type: 'String',
        generics: {},
        error: null
    });
    t.deepEqual(validate(expectedTypes, 42), {
        valid: true,
        type: 'Number',
        generics: {},
        error: null
    });
    t.deepEqual(validate(expectedTypes, new Date()), {
        valid: false,
        type: 'Date',
        generics: {},
        error: `Expected String or Number in \`${declaration}\` declaration but received Date.`
    });
});

test('It should be able to validate declarations with generic types;', t => {
    const declaration = 'forall a. a';
    const ast = parser.splitTypeDeclaration(declaration);
    const validate = createValidator(ast, declaration);
    const expectedTypes = ast.types[0];
    t.deepEqual(validate(expectedTypes, 'Adam'), {
        valid: true,
        type: 'a',
        generics: { a: 'String' },
        error: null
    });
    t.deepEqual(validate(expectedTypes, 'Adam', { a: 'String' }), {
        valid: true,
        type: 'a',
        generics: { a: 'String' },
        error: null
    });
    t.deepEqual(validate(expectedTypes, 42, { a: 'String' }), {
        valid: false,
        type: 'Number',
        generics: { a: 'String' },
        error: `Expected String in \`${declaration}\` declaration but received Number.`
    });
});

test('It should be able to validate declarations with array types;', t => {
    const declaration = 'String s => Array(s)';
    const ast = parser.splitTypeDeclaration(declaration);
    const validate = createValidator(ast, declaration);
    const expectedTypes = ast.types[0];
    t.deepEqual(validate(expectedTypes, ['Adam']), {
        valid: true,
        type: 'Array(s)',
        generics: {},
        error: null
    });
    t.deepEqual(validate(expectedTypes, ['Adam', 33]), {
        valid: false,
        type: 'Array',
        generics: {},
        error: `Expected Array(s) in \`${declaration}\` declaration but received Array(String, Number).`
    });
    t.deepEqual(validate(expectedTypes, 'Adam'), {
        valid: false,
        type: 'String',
        generics: {},
        error: `Expected Array(s) in \`${declaration}\` declaration but received String.`
    });
});

test('It should be able to validate declarations with object types;', t => {
    const declaration = 'String s => Object(name: s, age: Number)';
    const ast = parser.splitTypeDeclaration(declaration);
    const validate = createValidator(ast, declaration);
    const expectedTypes = ast.types[0];
    t.deepEqual(validate(expectedTypes, { name: 'Adam', age: 33 }), {
        valid: true,
        type: 'Object(name: s, age: Number)',
        generics: {},
        error: null
    });
    t.deepEqual(validate(expectedTypes, { name: 'Adam' }), {
        valid: false,
        type: 'Object',
        generics: {},
        error: `Expected Object(name: s, age: Number) in \`${declaration}\` declaration but received Object(name: String).`
    });
    t.deepEqual(validate(expectedTypes, { name: 'Adam', age: 33, location: 'Watford, UK' }), {
        valid: false,
        type: 'Object',
        generics: {},
        error: `Expected Object(name: s, age: Number) in \`${declaration}\` declaration but received Object(name: String, age: Number, location: String).`
    });
    t.deepEqual(validate(expectedTypes, 'Adam'), {
        valid: false,
        type: 'String',
        generics: {},
        error: `Expected Object(name: s, age: Number) in \`${declaration}\` declaration but received String.`
    });
});

test('It should be able to validate declarations with simple function types;', t => {
    const declaration = '(String -> Number -> String)';
    const ast = parser.splitTypeDeclaration(declaration);
    const validate = createValidator(ast, declaration);
    const expectedTypes = ast.types[0];
    t.deepEqual(
        validate(
            expectedTypes,
            defineType`String -> Number -> String`((name, age) => `Hello ${name}! You are ${age}.`)
        ),
        {
            valid: true,
            type: '(String -> Number -> String)',
            generics: {},
            error: null
        }
    );
    t.deepEqual(
        validate(
            expectedTypes,
            defineType`String -> String -> String`((name, age) => `Hello ${name}! You are ${age}.`)
        ),
        {
            valid: false,
            type: 'Function',
            generics: {},
            error:
                'Expected (String -> Number -> String) in `(String -> Number -> String)` declaration but received (String -> String -> String).'
        }
    );
});
