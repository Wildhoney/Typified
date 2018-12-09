import test from 'ava';
import type, { addScalarValidator } from '../index.js';
import { isFunction } from '../utils.js';

test('It should be able to carry forward the function name when defining its type;', t => {
    const getName = type`nameFunction ∷ String → String`(name => `Hello ${name}!`);
    const getAge = type`Number → String`(age => `You are ${age}.`);
    t.is(getName.name, 'nameFunction');
    t.is(getAge.name, 'userFunctionWrapped');
});

test('It should also be exporting the `addScalarValidator` function;', t => {
    t.true(isFunction(addScalarValidator));
});
