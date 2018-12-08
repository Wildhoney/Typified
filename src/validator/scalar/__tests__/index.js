import test from 'ava';
import { spy } from 'sinon';
import { addScalarValidator, validateScalar } from '../index.js';

test('It should allow the adding of custom scalar validators;', t => {
    const exampleValidator = spy();
    addScalarValidator('Example', exampleValidator);
    validateScalar(() => {}, 'Example(String)', 'Adam', {});
    t.is(exampleValidator.callCount, 1);
});
