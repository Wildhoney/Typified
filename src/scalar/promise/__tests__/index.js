import test from 'ava';
import * as parser from '../../../parser/index.js';
import { createValidator } from '../../../validator/index.js';

test('It should be able to validate declarations with concrete promise types;', async t => {
    const declaration = 'Promise(String)';
    const ast = parser.splitTypeDeclaration(declaration);
    const validate = createValidator(ast, declaration);
    const expectedTypes = ast.types[0];
    t.deepEqual(await validate(expectedTypes, Promise.resolve('Adam')), {
        valid: true,
        type: 'Promise(String)',
        generics: {},
        error: null
    });
    t.deepEqual(await validate(expectedTypes, Promise.resolve(33)), {
        valid: false,
        type: 'Promise',
        generics: {},
        error: 'Expected Promise(String) in `Promise(String)` declaration but received Promise.'
    });
});

test('It should be able to validate declarations with alias promise types;', async t => {
    const declaration = 'String s => Promise(s)';
    const ast = parser.splitTypeDeclaration(declaration);
    const validate = createValidator(ast, declaration);
    const expectedTypes = ast.types[0];
    t.deepEqual(await validate(expectedTypes, Promise.resolve('Adam')), {
        valid: true,
        type: 'Promise(s)',
        generics: {},
        error: null
    });
    t.deepEqual(await validate(expectedTypes, Promise.resolve(33)), {
        valid: false,
        type: 'Promise',
        generics: {},
        error: 'Expected Promise(s) in `String s => Promise(s)` declaration but received Promise.'
    });
});

test('It should be able to validate declarations with generic promise types;', async t => {
    const declaration = 'forall a. Promise(a)';
    const ast = parser.splitTypeDeclaration(declaration);
    const validate = createValidator(ast, declaration);
    const expectedTypes = ast.types[0];
    t.deepEqual(await validate(expectedTypes, Promise.resolve('Adam'), { a: 'String' }), {
        valid: true,
        type: 'Promise(a)',
        generics: { a: 'String' },
        error: null
    });
    t.deepEqual(await validate(expectedTypes, Promise.resolve('Adam'), { a: 'Number' }), {
        valid: false,
        type: 'Promise',
        generics: { a: 'Number' },
        error: 'Expected Promise(a) in `forall a. Promise(a)` declaration but received Promise.'
    });
});
