import test from 'ava';
import * as validatorUtils from '../utils.js';

test('It should be able to format the type mismatch and length messages;', t => {
    t.is(
        validatorUtils.formatTypeMismatchMessage(['String'], 'Number', 'Array(String) -> Date -> String'),
        'Expected String in `Array(String) -> Date -> String` declaration but received Number.'
    );
    t.is(
        validatorUtils.formatTypeMismatchMessage(
            ['String'],
            'Number',
            'Array(String) -> Date -> String',
            'Array values must be of a single type'
        ),
        'Expected String in `Array(String) -> Date -> String` declaration but received Number (Array values must be of a single type).'
    );
    t.is(
        validatorUtils.formatLengthMismatchMessage(3, 2, 'Number -> String -> Date'),
        'Expected 3 function parameters but received 2 in `Number -> String -> Date`.'
    );
});

test('It should be able to determine the types of values;', t => {
    t.is(validatorUtils.getPrimitiveType('Adam'), 'String');
    t.is(validatorUtils.getPrimitiveType([]), 'Array');
    t.is(validatorUtils.getPrimitiveType({ name: 'Adam' }), 'Object');
    t.is(validatorUtils.getPrimitiveType(new Date()), 'Date');
    t.is(validatorUtils.getPrimitiveType(new Promise(() => {})), 'Promise');
    t.is(validatorUtils.getPrimitiveType(global.BigInt(5)), 'BigInt');
    t.is(validatorUtils.getPrimitiveType(new Uint16Array()), 'Uint16Array');
    t.is(validatorUtils.getPrimitiveType(undefined), 'void');
    t.is(validatorUtils.getPrimitiveType(null), 'void');
});
