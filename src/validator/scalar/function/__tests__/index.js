import test from 'ava';
import * as parser from '../../../../parser/index.js';
import createValidator from '../../../../validator/index.js';
import type from '../../../../index.js';

test('It should be able to validate function types without a declaration;', t => {
    const sayHello = (name, age) => `Hello ${name}! You are ${age}.`;
    const declaration = '(String → Number → String)';
    const ast = parser.splitTypeDeclaration(declaration);
    const validate = createValidator(ast, declaration);
    const expectedTypes = ast.types[0];
    t.deepEqual(validate(expectedTypes, sayHello), {
        valid: true,
        type: '(String → Number → String)',
        generics: {},
        error: null
    });
});

test('It should be able to validate declarations with concrete function types;', t => {
    const sayHello = type`String → Number → String`((name, age) => `Hello ${name}! You are ${age}.`);
    const declaration =
        '(String → Number → String) → (String|Date → Boolean|Number → String) → (String → String → String)';
    const ast = parser.splitTypeDeclaration(declaration);
    const validate = createValidator(ast, declaration);
    t.deepEqual(validate(ast.types[0], sayHello), {
        valid: true,
        type: '(String → Number → String)',
        generics: {},
        error: null
    });
    t.deepEqual(validate(ast.types[1], sayHello), {
        valid: true,
        type: '(String|Date → Boolean|Number → String)',
        generics: {},
        error: null
    });
    t.deepEqual(validate(ast.types[2], sayHello), {
        valid: false,
        type: '(String → Number → String)',
        generics: {},
        error: {
            expected: ['(String → String → String)'],
            actual: '(String → Number → String)',
            types: [
                ['(String → Number → String)'],
                ['(String|Date → Boolean|Number → String)'],
                ['(String → String → String)']
            ]
        }
    });
});

test('It should be able to validate declarations with alias function types;', t => {
    const sayHello = type`String s ⇒ s → Number → s`((name, age) => `Hello ${name}! You are ${age}.`);
    const declaration = 'Number n, Date d ⇒ (String → n → String) → (String → n|d → String|Boolean) → (d → n → String)';
    const ast = parser.splitTypeDeclaration(declaration);
    const validate = createValidator(ast, declaration);
    t.deepEqual(validate(ast.types[0], sayHello), {
        valid: true,
        type: '(String → n → String)',
        generics: {},
        error: null
    });
    t.deepEqual(validate(ast.types[1], sayHello), {
        valid: true,
        type: '(String → n|d → String|Boolean)',
        generics: {},
        error: null
    });
    t.deepEqual(validate(ast.types[2], sayHello), {
        valid: false,
        type: '(String s ⇒ s → Number → s)',
        generics: {},
        error: {
            expected: ['(d → n → String)'],
            actual: '(String s ⇒ s → Number → s)',
            types: [['(String → n → String)'], ['(String → n|d → String|Boolean)'], ['(d → n → String)']]
        }
    });
});

test('It should be able to validate declarations with generic function types;', t => {
    const sayHello = type`String → Number → String`((name, age) => `Hello ${name}! You are ${age}.`);
    const declaration = '∀ a b c. (a → Number → a) → (a → b → c) → (a → a → a) → (x → y → z)';
    const ast = parser.splitTypeDeclaration(declaration);
    const validate = createValidator(ast, declaration);
    t.deepEqual(validate(ast.types[0], sayHello), {
        valid: true,
        type: '(a → Number → a)',
        generics: {},
        error: null
    });
    t.deepEqual(validate(ast.types[1], sayHello), {
        valid: true,
        type: '(a → b → c)',
        generics: {},
        error: null
    });
    t.deepEqual(validate(ast.types[2], sayHello), {
        valid: false,
        type: '(String → Number → String)',
        generics: {},
        error: {
            expected: ['(a → a → a)'],
            actual: '(String → Number → String)',
            types: [['(a → Number → a)'], ['(a → b → c)'], ['(a → a → a)'], ['(x → y → z)']]
        }
    });
    t.deepEqual(validate(ast.types[3], sayHello), {
        valid: false,
        type: '(String → Number → String)',
        generics: {},
        error: {
            expected: ['(x → y → z)'],
            actual: '(String → Number → String)',
            types: [['(a → Number → a)'], ['(a → b → c)'], ['(a → a → a)'], ['(x → y → z)']]
        }
    });
});

test('It should be able to validate declarations with reversed generic function types;', t => {
    const sayHello = type`∀ a b. a → b → a`((name, age) => `Hello ${name}! You are ${age}.`);
    const declaration = '∀ s n. (s → n → s) → (String → Number → String) → (s → s → s) → (s → n → n)';
    const ast = parser.splitTypeDeclaration(declaration);
    const validate = createValidator(ast, declaration);
    t.deepEqual(validate(ast.types[0], sayHello), {
        valid: true,
        type: '(s → n → s)',
        generics: {},
        error: null
    });
    t.deepEqual(validate(ast.types[1], sayHello), {
        valid: true,
        type: '(String → Number → String)',
        generics: {},
        error: null
    });
    t.deepEqual(validate(ast.types[2], sayHello), {
        valid: false,
        type: '(∀ a b. a → b → a)',
        generics: {},
        error: {
            expected: ['(s → s → s)'],
            actual: '(∀ a b. a → b → a)',
            types: [['(s → n → s)'], ['(String → Number → String)'], ['(s → s → s)'], ['(s → n → n)']]
        }
    });
    t.deepEqual(validate(ast.types[3], sayHello), {
        valid: false,
        type: '(∀ a b. a → b → a)',
        generics: {},
        error: {
            expected: ['(s → n → n)'],
            actual: '(∀ a b. a → b → a)',
            types: [['(s → n → s)'], ['(String → Number → String)'], ['(s → s → s)'], ['(s → n → n)']]
        }
    });
});
