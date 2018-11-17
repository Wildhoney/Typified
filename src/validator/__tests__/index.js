import test from 'ava';
import { createValidator } from '../index.js';
import * as parser from '../../parser/index.js';

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

test('It should be able to validate declarations with scalar types;', t => {
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
