import test from 'ava';
import * as validatorUtils from '../utils.js';

test('It should be able to format the type mismatch and length messages;', t => {
    t.is(
        validatorUtils.formatTypeMismatchMessage('String', 'Number', 'Array(String) -> Date -> String'),
        'Expected String in `Array(String) -> Date -> String` but received Number.'
    );

    t.is(
        validatorUtils.formatLengthMismatchMessage(3, 2, 'Number -> String -> Date'),
        'Expected 3 function parameters but received 2 in `Number -> String -> Date`.'
    );
});

test('It should be able to determine the types of values;', t => {
    t.is(validatorUtils.getParameterType('Adam'), 'String');
    t.is(validatorUtils.getParameterType([]), 'Array');
    t.is(validatorUtils.getParameterType({ name: 'Adam' }), 'Object');
    t.is(validatorUtils.getParameterType(new Date()), 'Date');
    t.is(validatorUtils.getParameterType(new Promise(() => {})), 'Promise');
    t.is(validatorUtils.getParameterType(global.BigInt(5)), 'BigInt');
    t.is(validatorUtils.getParameterType(new Uint16Array()), 'Uint16Array');
    t.is(validatorUtils.getParameterType(undefined), 'void');
    t.is(validatorUtils.getParameterType(null), 'void');
});
