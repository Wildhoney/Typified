import test from 'ava';
import * as u from '../utils.js';

test('It should be able to create either a Promise or FakePromise depending on async;', t => {
    const identity = a => a;
    t.true(u.createPromise(identity, true) instanceof Promise);
    t.true(u.createPromise(identity, false) instanceof u.FakePromise);
});

test('It should be able to take a FakePromise that resolves synchronously;', t => {
    const promise = new u.FakePromise('Adam');
    promise.then(value => t.is(value, 'Adam'));
});
