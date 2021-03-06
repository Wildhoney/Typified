import test from 'ava';
import * as parser from '../../../../parser/index.js';
import createValidator from '../../../../validator/index.js';
import type from '../../../../index.js';

test('It should be able to validate declarations with array types;', t => {
    const declaration = 'String s ⇒ Array(s)';
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
        type: 'Array(String, Number)',
        generics: {},
        error: { expected: ['Array(s)'], actual: 'Array(String, Number)', types: [['Array(s)']] }
    });
    t.deepEqual(validate(expectedTypes, 'Adam'), {
        valid: false,
        type: 'String',
        generics: {},
        error: { expected: ['Array(s)'], actual: 'String', types: [['Array(s)']] }
    });
});

test('It should be able to validate concrete function declarations with array types;', t => {
    const sayHello = type`Array(String) → Array(Number)`(
        (names, ages) => `Hello ${names.join(' & ')}! You are ${ages.reduce((a, b) => a + b, 0)} combined.`
    );
    const declaration = '(Array(String) → Array(Number))';
    const ast = parser.splitTypeDeclaration(declaration);
    const validate = createValidator(ast, declaration);
    t.deepEqual(validate(ast.types[0], sayHello), {
        valid: true,
        type: '(Array(String) → Array(Number))',
        generics: {},
        error: null
    });
});

test('It should be able to validate alias function declarations with array types;', t => {
    const sayHello = type`String s ⇒ Array(s) → Array(Number)`(
        (names, ages) => `Hello ${names.join(' & ')}! You are ${ages.reduce((a, b) => a + b, 0)} combined.`
    );
    const declaration = 'String str, Number num ⇒ (Array(str) → Array(num))';
    const ast = parser.splitTypeDeclaration(declaration);
    const validate = createValidator(ast, declaration);
    t.deepEqual(validate(ast.types[0], sayHello), {
        valid: true,
        type: '(Array(str) → Array(num))',
        generics: {},
        error: null
    });
});

test('It should be able to validate generic function declarations with array types;', t => {
    const sayHello = type`∀ a b. Array(a) → Array(b)`(
        (names, ages) => `Hello ${names.join(' & ')}! You are ${ages.reduce((a, b) => a + b, 0)} combined.`
    );
    const declaration = '∀ x. (Array(x) → Array(Number))';
    const ast = parser.splitTypeDeclaration(declaration);
    const validate = createValidator(ast, declaration);
    t.deepEqual(validate(ast.types[0], sayHello), {
        valid: true,
        type: '(Array(x) → Array(Number))',
        generics: {},
        error: null
    });
});
