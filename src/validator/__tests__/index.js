import test from 'ava';
import * as parser from '../../parser/index.js';
// import defineType from '../../index.js';
import { createValidator, contexts } from '../index.js';

test('It should be able to validate declarations with concrete types;', t => {
    const declaration = 'String|Number';
    const ast = parser.splitTypeDeclaration(declaration);
    const validate = createValidator(contexts.VALUE, ast, declaration);
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
    const validate = createValidator(contexts.VALUE, ast, declaration);
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
    const validate = createValidator(contexts.VALUE, ast, declaration);
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
    const validate = createValidator(contexts.VALUE, ast, declaration);
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
    const validate = createValidator(contexts.VALUE, ast, declaration);
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

test('It should be able to validate declarations with concrete function types;', t => {
    const declaration = 'String';
    const sourceAst = parser.splitTypeDeclaration(declaration);
    const targetAst = parser.splitTypeDeclaration('String');
    const validate = createValidator(contexts.TYPE, [sourceAst, targetAst], declaration);
    t.deepEqual(validate(sourceAst.types[0], targetAst.types[0]), { valid: true, generics: {}, error: null });
});

test('It should be able to validate declarations with alias function types;', t => {
    const declaration = 'String s => s';
    const sourceAst = parser.splitTypeDeclaration(declaration);
    const targetAst = parser.splitTypeDeclaration('String');
    const validate = createValidator(contexts.TYPE, [sourceAst, targetAst], declaration);
    t.deepEqual(validate(sourceAst.types[0], targetAst.types[0]), { valid: true, generics: {}, error: null });
});

test('It should be able to validate declarations with alias function types;', t => {
    const declaration = 'String';
    const sourceAst = parser.splitTypeDeclaration(declaration);
    const targetAst = parser.splitTypeDeclaration('String s => s');
    const validate = createValidator(contexts.TYPE, [sourceAst, targetAst], declaration);
    t.deepEqual(validate(sourceAst.types[0], targetAst.types[0]), { valid: true, generics: {}, error: null });
});

test('It should be able to validate declarations with generic function types;', t => {
    const declaration = 'forall a. a';
    const sourceAst = parser.splitTypeDeclaration(declaration);
    const targetAst = parser.splitTypeDeclaration('String');
    const validate = createValidator(contexts.TYPE, [sourceAst, targetAst], declaration);
    t.deepEqual(validate(sourceAst.types[0], targetAst.types[0], { a: 'String' }), {
        valid: true,
        generics: { a: 'String' },
        error: null
    });
    t.deepEqual(validate(sourceAst.types[0], targetAst.types[0], { a: 'Number' }), {
        valid: false,
        generics: { a: 'Number' },
        error: `Expected a in \`${declaration}\` declaration but received String.`
    });
});

test('It should be able to validate declarations with reversed generic function types;', t => {
    const declaration = 'Date';
    const sourceAst = parser.splitTypeDeclaration(declaration);
    const targetAst = parser.splitTypeDeclaration('forall a. a');
    const validate = createValidator(contexts.TYPE, [sourceAst, targetAst], declaration);
    t.deepEqual(validate(sourceAst.types[0], targetAst.types[0]), {
        valid: true,
        generics: { a: 'Date' },
        error: null
    });
    t.deepEqual(validate(sourceAst.types[0], targetAst.types[0], { a: 'Boolean' }), {
        valid: false,
        generics: { a: 'Boolean' },
        error: `Expected Date in \`${declaration}\` declaration but received a.`
    });
});

test('It should be able to validate declarations with array function types;', t => {
    const declaration = 'String s => Array(s) -> Array(Number)';
    const sourceAst = parser.splitTypeDeclaration(declaration);
    const targetAst = parser.splitTypeDeclaration('Array(String) -> Array(Date)');
    const validate = createValidator(contexts.TYPE, [sourceAst, targetAst], declaration);
    t.deepEqual(validate(sourceAst.types[0], targetAst.types[0]), { valid: true, generics: {}, error: null });
    // t.deepEqual(validate(sourceAst.types[1], targetAst.types[1]), { valid: false, generics: {}, error: null });
});

test('It should be able to validate declarations with object function types;', t => {
    const declaration = 'String s => Object(name: s, age: Number)';
    const sourceAst = parser.splitTypeDeclaration(declaration);
    const targetAst = parser.splitTypeDeclaration('Object(name: String, age: Number)');
    const validate = createValidator(contexts.TYPE, [sourceAst, targetAst], declaration);
    t.deepEqual(validate(sourceAst.types[0], targetAst.types[0]), { valid: true, generics: {}, error: null });
});
