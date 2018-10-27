import test from 'ava';
import * as parserUtils from '../utils.js';

test('It should be able to determine if a type is a scalar type;', t => {
    t.deepEqual(parserUtils.maybeParseScalar('Array(String)'), {
        type: 'Array',
        description: 'String'
    });
    t.deepEqual(parserUtils.maybeParseScalar('Object(name: String)'), {
        type: 'Object',
        description: 'name: String'
    });
    t.is(parserUtils.maybeParseScalar('String'), null);
});
