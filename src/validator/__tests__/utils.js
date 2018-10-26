import test from 'ava';
import * as validatorUtils from '../utils.js';

test('It should be able to format the type mismatch and length messages;', t => {
    t.is(
        validatorUtils.formatTypeMismatchMessage(
            'String',
            'Number',
            'Array(String) -> Date -> String'
        ),
        'Expected String in `Array(String) -> Date -> String` but received Number.'
    );

    t.is(
        validatorUtils.formatLengthMismatchMessage(3, 2, 'Number -> String -> Date'),
        'Expected 3 function parameters but received 2 in `Number -> String -> Date`.'
    );
});
