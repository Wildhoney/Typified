import test from 'ava';
import * as parserUtils from '../utils.js';

test('It should be able to determine if a type is a scalar type;', t => {
    t.deepEqual(parserUtils.getScalarAst('Array(String)'), {
        type: 'Array',
        description: 'String'
    });
    t.deepEqual(parserUtils.getScalarAst('Object(name: String)'), {
        type: 'Object',
        description: 'name: String'
    });
    t.is(parserUtils.getScalarAst('String'), null);
});
