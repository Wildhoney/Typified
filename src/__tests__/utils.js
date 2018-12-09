import test from 'ava';
import * as u from '../utils.js';

test('It should also be able to determine when a value us a function;', t => {
    t.true(u.isFunction(() => {}));
    t.false(u.isFunction('Adam'));
});

test('It should be able to concatenate a template literal when passing variables;', t => {
    const CustomType = 'Object(name: String, age: Number)';
    const type = (types, ...expressions) => u.concatTemplate(types, expressions);
    const typed = type`String → ${CustomType}`;
    t.is(typed, 'String → Object(name: String, age: Number)');
});
