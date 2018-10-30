import test from 'ava';
import validate from '../index.js';
import * as parser from '../../parser/index.js';

test('It should be able to validate a simple typed function;', t => {
    const declaration = 'String -> String -> String';
    const ast = parser.splitTypeDeclaration(declaration);
    const parameters = ['Hello', 'Adam', 'Hello, Adam!'];
    t.deepEqual(validate(ast, declaration, parameters), {
        generics: {},
        errors: []
    });
});

test('It should be able to validate a simple typed function with an alias;', t => {
    const declaration = 'String s => s -> s -> Number -> s';
    const ast = parser.splitTypeDeclaration(declaration);
    const parameters = ['Hello', 'Adam', 33, 'Hello Adam. You are 33.'];
    t.deepEqual(validate(ast, declaration, parameters), {
        generics: {},
        errors: []
    });
});

test('It should be able to validate a simple union typed function;', t => {
    const declaration = 'String -> String|Number -> String';
    const ast = parser.splitTypeDeclaration(declaration);
    const parameters = [['Hello', 'Adam', 'Hello, Adam!'], ['Hello', 12, 'Hello, Adam!']];
    parameters.forEach(parameters =>
        t.deepEqual(validate(ast, declaration, parameters), {
            generics: {},
            errors: []
        })
    );
});

test('It should be able to validate a simple generic typed function;', t => {
    const declaration = 'forall a. a -> a -> a';
    const ast = parser.splitTypeDeclaration(declaration);
    const parameters = ['Hello', 'Adam', 'Hello, Adam!'];
    t.deepEqual(validate(ast, declaration, parameters), {
        generics: { a: 'String' },
        errors: []
    });
});

test('It should be able to validate a generic a more complex generic function;', t => {
    const declaration = 'forall a b. a -> a -> b -> b -> a';
    const ast = parser.splitTypeDeclaration(declaration);
    const parameters = ['Adam', 'Maria', 33, 28, 'Hello Adam & Maria. You are 33 and 28.'];
    t.deepEqual(validate(ast, declaration, parameters), {
        generics: { a: 'String', b: 'Number' },
        errors: []
    });
});

test('It should be able to validate a scalar typed function;', t => {
    const declaration = 'Array(String) -> String';
    const ast = parser.splitTypeDeclaration(declaration);
    const parameters = [['Adam', 'Maria'], 'Hello Adam & Maria!'];
    t.deepEqual(validate(ast, declaration, parameters), {
        generics: {},
        errors: []
    });
});

test('It should be able to validate a scalar typed function with generics added to the mix;', t => {
    const declaration = 'forall a b. Array(a) -> Array(b) -> a';
    const ast = parser.splitTypeDeclaration(declaration);
    const parameters = [['Adam', 'Maria'], [33, 28], 'Hello Adam & Maria. You are 33 and 28.'];
    t.deepEqual(validate(ast, declaration, parameters), {
        generics: { a: 'String', b: 'Number' },
        errors: []
    });
});
