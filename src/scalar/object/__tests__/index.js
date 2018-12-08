import test from 'ava';
import * as parser from '../../../parser/index.js';
import createValidator from '../../../validator/index.js';
import type from '../../../index.js';

test('It should be able to validate declarations with object types;', t => {
    const declaration = 'String s ⇒ Object(name: s, age: Number)';
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
        type: 'Object(name: String)',
        generics: {},
        error: {
            expected: ['Object(name: s, age: Number)'],
            actual: 'Object(name: String)',
            types: [['Object(name: s, age: Number)']]
        }
    });
    t.deepEqual(validate(expectedTypes, { name: 'Adam', age: 33, location: 'Watford, UK' }), {
        valid: false,
        type: 'Object(name: String, age: Number, location: String)',
        generics: {},
        error: {
            expected: ['Object(name: s, age: Number)'],
            actual: 'Object(name: String, age: Number, location: String)',
            types: [['Object(name: s, age: Number)']]
        }
    });
    t.deepEqual(validate(expectedTypes, 'Adam'), {
        valid: false,
        type: 'String',
        generics: {},
        error: {
            expected: ['Object(name: s, age: Number)'],
            actual: 'String',
            types: [['Object(name: s, age: Number)']]
        }
    });
});

test('It should be able to validate concrete function declarations with array types;', t => {
    const sayHello = type`Object(name: String, age: Number) → String`((name, age) => `Hello ${name}! You are ${age}.`);
    const declaration = '(Object(name: String, age: Number) → String)';
    const ast = parser.splitTypeDeclaration(declaration);
    const validate = createValidator(ast, declaration);
    t.deepEqual(validate(ast.types[0], sayHello), {
        valid: true,
        type: '(Object(name: String, age: Number) → String)',
        generics: {},
        error: null
    });
});

test('It should be able to validate alias function declarations with array types;', t => {
    const sayHello = type`String s ⇒ Object(name: s, age: Number) → String`(
        (name, age) => `Hello ${name}! You are ${age}.`
    );
    const declaration = 'String str, Number num ⇒ (Object(name: str, age: num) → String)';
    const ast = parser.splitTypeDeclaration(declaration);
    const validate = createValidator(ast, declaration);
    t.deepEqual(validate(ast.types[0], sayHello), {
        valid: true,
        type: '(Object(name: str, age: num) → String)',
        generics: {},
        error: null
    });
});

test('It should be able to validate generic function declarations with array types;', t => {
    const sayHello = type`∀ a b. Object(name: a, age: b) → a`((name, age) => `Hello ${name}! You are ${age}.`);
    const declaration = '∀ x y. (Object(name: x, age: y) → x)';
    const ast = parser.splitTypeDeclaration(declaration);
    const validate = createValidator(ast, declaration);
    t.deepEqual(validate(ast.types[0], sayHello), {
        valid: true,
        type: '(Object(name: x, age: y) → x)',
        generics: {},
        error: null
    });
});
