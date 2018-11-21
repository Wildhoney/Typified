import test from 'ava';
import * as parser from '../../../parser/index.js';
import { createValidator } from '../../../validator/index.js';

test('It should be able to validate declarations with object types;', t => {
    const declaration = 'String s => Object(name: s, age: Number)';
    const ast = parser.splitTypeDeclaration(declaration);
    const validate = createValidator(ast, declaration);
    const expectedTypes = ast.types[0];
    t.deepEqual(validate(expectedTypes, { name: 'Adam', age: 33 }), {
        valid: true,
        type: 'Object(name: s, age: Number)',
        generics: {},
        error: null
    });
    t.deepEqual(validate(expectedTypes, { name: 'Adam' }), {
        valid: false,
        type: 'Object',
        generics: {},
        error: `Expected Object(name: s, age: Number) in \`${declaration}\` declaration but received Object(name: String).`
    });
    t.deepEqual(validate(expectedTypes, { name: 'Adam', age: 33, location: 'Watford, UK' }), {
        valid: false,
        type: 'Object',
        generics: {},
        error: `Expected Object(name: s, age: Number) in \`${declaration}\` declaration but received Object(name: String, age: Number, location: String).`
    });
    t.deepEqual(validate(expectedTypes, 'Adam'), {
        valid: false,
        type: 'String',
        generics: {},
        error: `Expected Object(name: s, age: Number) in \`${declaration}\` declaration but received String.`
    });
});
