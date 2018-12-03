import test from 'ava';
import * as parser from '../../../parser/index.js';
import { createValidator } from '../../../validator/index.js';

test('It should be able to validate declarations with promise types;', async t => {
    const declaration = 'Promise(String)';
    const ast = parser.splitTypeDeclaration(declaration);
    const validate = createValidator(ast, declaration);
    const expectedTypes = ast.types[0];
    t.deepEqual(await validate(expectedTypes, Promise.resolve('Adam')), {
        valid: true,
        type: 'Promise(String)',
        generics: {},
        error: null
    });
});
