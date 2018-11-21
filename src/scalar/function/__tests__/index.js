import test from 'ava';
import * as parser from '../../../parser/index.js';
import { createValidator } from '../../../validator/index.js';
import type from '../../../index.js';

test('It should be able to validate function types without a declaration;', t => {
    const sayHello = (name, age) => `Hello ${name}! You are ${age}.`;
    const declaration = '(String -> Number -> String)';
    const ast = parser.splitTypeDeclaration(declaration);
    const validate = createValidator(ast, declaration);
    const expectedTypes = ast.types[0];
    t.deepEqual(validate(expectedTypes, sayHello), {
        valid: true,
        type: '(String -> Number -> String)',
        generics: {},
        error: null
    });
});

test('It should be able to validate declarations with concrete function types;', t => {
    const sayHello = type`String -> Number -> String`((name, age) => `Hello ${name}! You are ${age}.`);
    const declaration = '(String -> Number -> String) -> (String -> String -> String)';
    const ast = parser.splitTypeDeclaration(declaration);
    const validate = createValidator(ast, declaration);
    t.deepEqual(validate(ast.types[0], sayHello), {
        valid: true,
        type: '(String -> Number -> String)',
        generics: {},
        error: null
    });
    t.deepEqual(validate(ast.types[1], sayHello), {
        valid: false,
        type: 'Function',
        generics: {},
        error:
            'Expected (String -> String -> String) in `(String -> Number -> String) -> (String -> String -> String)` declaration but received (String -> Number -> String).'
    });
});

test('It should be able to validate declarations with alias function types;', t => {
    const sayHello = type`String s => s -> Number -> s`((name, age) => `Hello ${name}! You are ${age}.`);
    const declaration = 'Number n, Date d => (String -> n -> String) -> (d -> n -> String)';
    const ast = parser.splitTypeDeclaration(declaration);
    const validate = createValidator(ast, declaration);
    t.deepEqual(validate(ast.types[0], sayHello), {
        valid: true,
        type: '(String -> n -> String)',
        generics: {},
        error: null
    });
    t.deepEqual(validate(ast.types[1], sayHello), {
        valid: false,
        type: 'Function',
        generics: {},
        error:
            'Expected (d -> n -> String) in `Number n, Date d => (String -> n -> String) -> (d -> n -> String)` declaration but received (String s => s -> Number -> s).'
    });
});
