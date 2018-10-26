import test from 'ava';
import * as astUtils from '../utils.js';

test('It should be able to determine if a type is a scalar type;', t => {
    t.deepEqual(astUtils.maybeParseScalar('Array(String)'), {
        isScalar: true,
        ast: { type: 'Array', description: 'String' }
    });

    t.deepEqual(astUtils.maybeParseScalar('Object(name: String)'), {
        isScalar: true,
        ast: { type: 'Object', description: 'name: String' }
    });

    t.deepEqual(astUtils.maybeParseScalar('String'), {
        isScalar: false,
        ast: null
    });
});
