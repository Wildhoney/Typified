import test from 'ava';
import * as validatorUtils from '../utils.js';
import { splitTypeDeclaration } from '../../parser/index.js';

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
    t.is(validatorUtils.getType('Adam'), 'String');
    t.is(validatorUtils.getType([]), 'Array');
    t.is(validatorUtils.getType({ name: 'Adam' }), 'Object');
    t.is(validatorUtils.getType(new Date()), 'Date');
    t.is(validatorUtils.getType(new Promise(() => {})), 'Promise');
    t.is(validatorUtils.getType(global.BigInt(5)), 'BigInt');
    t.is(validatorUtils.getType(new Uint16Array()), 'Uint16Array');
    t.is(validatorUtils.getType(undefined), 'void');
    t.is(validatorUtils.getType(null), 'void');
    t.is(validatorUtils.getType(new validatorUtils.Type('Number', splitTypeDeclaration('Number'))), 'Number');
    t.is(validatorUtils.getType(new validatorUtils.Type('n', splitTypeDeclaration('Number n => n'))), 'Number');
});
