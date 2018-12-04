import test from 'ava';
import * as u from '../utils.js';
import { splitTypeDeclaration } from '../../parser/index.js';
import type from '../../index.js';

test('It should be able to format the type mismatch and length messages;', t => {
    t.is(
        u.formatTypeMismatchMessage(['String'], 'Number', 'Array(String) → Date → String'),
        'Expected String in `Array(String) → Date → String` declaration but received Number.'
    );
    t.is(
        u.formatTypeMismatchMessage(
            ['String'],
            'Number',
            'Array(String) → Date → String',
            'Array values must be of a single type'
        ),
        'Expected String in `Array(String) → Date → String` declaration but received Number (Array values must be of a single type).'
    );
    t.is(
        u.formatLengthMismatchMessage(3, 2, 'Number → String → Date'),
        'Expected 3 function parameters but received 2 in `Number → String → Date`.'
    );
});

test('It should be able to determine the types of values;', t => {
    t.is(u.getType('Adam'), 'String');
    t.is(u.getType([]), 'Array');
    t.is(u.getType({ name: 'Adam' }), 'Object');
    t.is(u.getType(new Date()), 'Date');
    t.is(u.getType(new Promise(() => {})), 'Promise');
    t.is(u.getType(global.BigInt(5)), 'BigInt');
    t.is(u.getType(new Uint16Array()), 'Uint16Array');
    t.is(u.getType(undefined), 'void');
    t.is(u.getType(null), 'void');
    t.is(u.getType(new u.Type('Number', splitTypeDeclaration('Number'))), 'Number');
    t.is(u.getType(new u.Type('n', splitTypeDeclaration('Number n ⇒ n'))), 'Number');
});

test('It should be able to handle `Type` values;', t => {
    const type = new u.Type('s', splitTypeDeclaration('∀ a. String s, Date d ⇒ s → d'));
    t.is(u.getType(type), 'String');
    t.is(u.getType(type.set('d')), 'Date');
    t.true(type.set('a').isGeneric());
    t.false(type.set('s').isGeneric());
});

test('It should be able to determine the actual type of values;', async t => {
    t.is(u.determineActualType(null), 'void');
    t.is(u.determineActualType(undefined), 'void');
    t.is(u.determineActualType('Adam'), 'String');
    t.is(u.determineActualType(33), 'Number');
    t.is(u.determineActualType(['Adam']), 'Array(String)');
    t.is(u.determineActualType(['Adam', 33]), 'Array(String, Number)');
    t.is(u.determineActualType({ name: 'Adam' }), 'Object(name: String)');
    t.is(u.determineActualType({ name: 'Adam', age: 33 }), 'Object(name: String, age: Number)');
    t.is(
        u.determineActualType({ name: 'Adam', locations: ['UK', 'RU'] }),
        'Object(name: String, locations: Array(String))'
    );
    t.is(await u.determineActualType(Promise.resolve('Adam')), 'Promise(String)');
    t.is(u.determineActualType(type`String → String`(name => 'Hello ' + name)), '(String → String)');
    t.is(
        u.determineActualType({ names: { first: 'Adam', last: 'Timberlake' }, age: 33, locations: ['UK', 'RU'] }),
        'Object(names: Object(first: String, last: String), age: Number, locations: Array(String))'
    );
});

test('It should be able to determine when a type is a scalar;', t => {
    t.true(u.isScalar('Array(String)'));
    t.true(u.isScalar('Promise(a)'));
    t.false(u.isScalar('Date'));
    t.false(u.isScalar('String'));
});

test('It should be able to determine when a value is a `Type`;', t => {
    t.true(u.isType(new u.Type('String', splitTypeDeclaration('String'))));
    t.false(u.isType('Adam'));
    t.false(u.isType(33));
});

test('It should be able to clone the `Type` instance when using `set`;', t => {
    const type = new u.Type('String', splitTypeDeclaration('String'));
    t.is(type.get(), 'String');
    const { ast, ref } = type;
    const newType = type.set('Number');
    t.is(newType.ast, ast);
    t.is(newType.ref, ref);
    t.is(newType.get(), 'Number');
});
