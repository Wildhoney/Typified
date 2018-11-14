import test from 'ava';
import createValidator from '../index.js';
import * as parser from '../../parser/index.js';

test('It should be able to validate union types;', t => {
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

test('It should be able to validate union types with aliases;', t => {
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

test('It should be able to validate union types with generics;', t => {
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
        type: 'String',
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

// test('It should be able to validate a generic a more complex generic function;', t => {
//     const declaration = 'forall a b. a -> a -> b -> b -> a';
//     const ast = parser.splitTypeDeclaration(declaration);
//     const parameters = ['Adam', 'Maria', 33, 28, 'Hello Adam & Maria. You are 33 and 28.'];
//     t.deepEqual(validate(ast, declaration, parameters), {
//         generics: { a: 'String', b: 'Number' },
//         errors: [],
//         type: 'a'
//     });
// });

// test('It should be able to validate a scalar typed function;', t => {
//     const declaration = 'Array(String) -> String';
//     const ast = parser.splitTypeDeclaration(declaration);
//     const parameters = [['Adam', 'Maria'], 'Hello Adam & Maria!'];
//     t.deepEqual(validate(ast, declaration, parameters), {
//         generics: {},
//         errors: [],
//         type: 'String'
//     });
// });

// test('It should be able to validate a scalar typed function with generics added to the mix;', t => {
//     const declaration = 'forall a b. Array(a) -> Array(b) -> a';
//     const ast = parser.splitTypeDeclaration(declaration);
//     const parameters = [['Adam', 'Maria'], [33, 28], 'Hello Adam & Maria. You are 33 and 28.'];
//     t.deepEqual(validate(ast, declaration, parameters), {
//         generics: { a: 'String', b: 'Number' },
//         errors: [],
//         type: 'a'
//     });
// });
