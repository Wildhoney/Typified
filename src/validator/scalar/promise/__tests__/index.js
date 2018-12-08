import test from 'ava';
import * as parser from '../../../../parser/index.js';
import createValidator from '../../../../validator/index.js';
import type from '../../../../index.js';

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
        type: 'Promise(Number)',
        generics: {},
        error: { expected: ['Promise(String)'], actual: 'Promise(Number)', types: [['Promise(String)']] }
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
        type: 'Promise(Number)',
        generics: {},
        error: { expected: ['Promise(s)'], actual: 'Promise(Number)', types: [['Promise(s)']] }
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
        type: 'Promise(String)',
        generics: { a: 'Number' },
        error: { expected: ['Promise(a)'], actual: 'Promise(String)', types: [['Promise(a)']] }
    });
});

test('It should be able to validate concrete function declarations with promise types;', t => {
    const sayHello = type`Promise(String) → Promise(Number)`(
        (names, ages) => `Hello ${names.join(' & ')}! You are ${ages.reduce((a, b) => a + b, 0)} combined.`
    );
    const declaration =
        'forall a. String s => (Promise(String) → Promise(Number)) → (Promise(Number|a) -> Promise(Number|s))';
    const ast = parser.splitTypeDeclaration(declaration);
    const validate = createValidator(ast, declaration);
    t.deepEqual(validate(ast.types[0], sayHello), {
        valid: true,
        type: '(Promise(String) → Promise(Number))',
        generics: {},
        error: null
    });
    t.deepEqual(validate(ast.types[1], sayHello), {
        valid: true,
        type: '(Promise(Number|a) → Promise(Number|s))',
        generics: {},
        error: null
    });
});
