import test from 'ava';
import * as u from '../utils.js';

test('It should be able to determine if a type is a scalar type;', t => {
    t.deepEqual(u.parseScalar('Array(String)'), {
        type: 'Array',
        description: 'String'
    });
    t.deepEqual(u.parseScalar('Object(name: String)'), {
        type: 'Object',
        description: 'name: String'
    });
    t.deepEqual(u.parseScalar('(String → Number → Boolean)'), {
        description: 'String → Number → Boolean',
        type: ''
    });
    t.is(u.parseScalar('String'), null);
});

test('It should be able to split at the top level only;', t => {
    t.deepEqual(
        u.splitTopLevel(
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
