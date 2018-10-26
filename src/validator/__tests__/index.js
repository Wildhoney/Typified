import test from 'ava';
import validate from '../index.js';

test('It should be able to validate a simple typed function;', t => {
    const declaration = 'String -> String -> String';
    const parameters = ['Hello', 'Adam', 'Hello, Adam!'];
    t.deepEqual(validate(declaration, parameters), {
        generics: {},
        errors: []
    });
});

test('It should be able to validate a simple typed function with an alias;', t => {
    const declaration = 'String s => s -> s -> Number -> s';
    const parameters = ['Hello', 'Adam', 33, 'Hello Adam. You are 33.'];
    t.deepEqual(validate(declaration, parameters), {
        generics: {},
        errors: []
    });
});

test('It should be able to validate a simple union typed function;', t => {
    const declaration = 'String -> String|Number -> String';
    const parameters = [['Hello', 'Adam', 'Hello, Adam!'], ['Hello', 12, 'Hello, Adam!']];
    parameters.forEach(parameters =>
        t.deepEqual(validate(declaration, parameters), {
            generics: {},
            errors: []
        })
    );
});

test('It should be able to validate a simple generic typed function;', t => {
    const declaration = 'forall a. a -> a -> a';
    const parameters = ['Hello', 'Adam', 'Hello, Adam!'];
    t.deepEqual(validate(declaration, parameters), {
        generics: { a: 'String' },
        errors: []
    });
});

test('It should be able to validate a generic a more complex generic function;', t => {
    const declaration = 'forall a b. a -> a -> b -> b -> a';
    const parameters = ['Adam', 'Maria', 33, 28, 'Hello Adam & Maria. You are 33 and 28.'];
    t.deepEqual(validate(declaration, parameters), {
        generics: { a: 'String', b: 'Number' },
        errors: []
    });
});
