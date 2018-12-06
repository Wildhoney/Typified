import test from 'ava';
import * as parser from '../../parser/index.js';
import { createValidator, produceValidationReport } from '../index.js';

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
    const declaration = 'String s, Number n ⇒ s|n';
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
    const declaration = '∀ a. a';
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

test('It should be able to validate on the argument length versus types length;', t => {
    const declaration = 'String → String';
    const ast = parser.splitTypeDeclaration(declaration);
    const validate = createValidator(ast, declaration);
    t.deepEqual(produceValidationReport(validate, ast.types, ['Adam', 'Maria'], declaration), {
        valid: true,
        reports: [
            { valid: true, type: 'String', generics: {}, error: null },
            { valid: true, type: 'String', generics: {}, error: null }
        ],
        generics: {},
        error: null
    });
    t.deepEqual(produceValidationReport(validate, ast.types, ['Adam'], declaration), {
        valid: false,
        reports: [],
        generics: {},
        error: 'Expected 2 function parameters but received 1 parameter in `String → String`.'
    });
    t.deepEqual(produceValidationReport(validate, ast.types.slice(0, 1), ['Adam', 'Maria'], declaration), {
        valid: false,
        reports: [],
        generics: {},
        error: 'Expected 1 function parameter but received 2 parameters in `String → String`.'
    });
});

test('It should be able to validate on argument length with concrete `void` types;', t => {
    const declaration = 'String → void|String';
    const ast = parser.splitTypeDeclaration(declaration);
    const validate = createValidator(ast, declaration);
    t.deepEqual(produceValidationReport(validate, ast.types, ['Adam'], declaration), {
        valid: true,
        reports: [
            { valid: true, type: 'String', generics: {}, error: null },
            { valid: true, type: 'void', generics: {}, error: null }
        ],
        generics: {},
        error: null
    });
    t.deepEqual(produceValidationReport(validate, ast.types, ['Adam', 'Maria'], declaration), {
        valid: true,
        reports: [
            { valid: true, type: 'String', generics: {}, error: null },
            { valid: true, type: 'String', generics: {}, error: null }
        ],
        generics: {},
        error: null
    });
    t.deepEqual(produceValidationReport(validate, ast.types, ['Adam', 'Maria', '...'], declaration), {
        valid: false,
        reports: [],
        generics: {},
        error: 'Expected 2 function parameters but received 3 parameters in `String → void|String`.'
    });
});

test('It should be able to validate on argument length with alias `void` types;', t => {
    const declaration = 'String s, void v ⇒ String → v|s';
    const ast = parser.splitTypeDeclaration(declaration);
    const validate = createValidator(ast, declaration);
    t.deepEqual(produceValidationReport(validate, ast.types, ['Adam'], declaration), {
        valid: true,
        reports: [
            { valid: true, type: 'String', generics: {}, error: null },
            { valid: true, type: 'void', generics: {}, error: null }
        ],
        generics: {},
        error: null
    });
    t.deepEqual(produceValidationReport(validate, ast.types, ['Adam', 'Maria'], declaration), {
        valid: true,
        reports: [
            { valid: true, type: 'String', generics: {}, error: null },
            { valid: true, type: 'String', generics: {}, error: null }
        ],
        generics: {},
        error: null
    });
    t.deepEqual(produceValidationReport(validate, ast.types, ['Adam', 'Maria', '...'], declaration), {
        valid: false,
        reports: [],
        generics: {},
        error: 'Expected 2 function parameters but received 3 parameters in `String s, void v ⇒ String → v|s`.'
    });
});
