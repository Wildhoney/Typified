import test from 'ava';
import * as parserUtils from '../utils.js';

test('It should be able to determine if a type is a scalar type;', t => {
    t.deepEqual(parserUtils.parseScalar('Array(String)'), {
        type: 'Array',
        description: 'String'
    });
    t.deepEqual(parserUtils.parseScalar('Object(name: String)'), {
        type: 'Object',
        description: 'name: String'
    });
    t.deepEqual(parserUtils.parseScalar('(String → Number → Boolean)'), {
        description: 'String → Number → Boolean',
        type: ''
    });
    t.is(parserUtils.parseScalar('String'), null);
});

test('It should be able to split at the top level only;', t => {
    t.deepEqual(
        parserUtils.splitTopLevel(
            'String, Number, Tuple(String, Number), Object(name: Object(first: String, last: String), age: Number), Date, String',
            ','
        ),
        [
            'String',
            'Number',
            'Tuple(String, Number)',
            'Object(name: Object(first: String, last: String), age: Number)',
            'Date',
            'String'
        ]
    );
});
