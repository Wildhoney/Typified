import test from 'ava';
import { splitTypeDeclaration } from '../../parser/index.js';
import * as u from '../utils.js';

test('It should be able to colour the types given a highlight position;', t => {
    t.deepEqual(u.colouredTypes(['String', 'Number'], 0), {
        types: '%cString%c → %cNumber%c',
        styles: [
            'color: deeppink; font-weight: bold; text-decoration: underline',
            '#656d78',
            'color: deeppink',
            '#656d78'
        ]
    });
    t.deepEqual(u.colouredTypes(['String', 'Number'], 1), {
        types: '%cString%c → %cNumber%c',
        styles: [
            'color: deeppink',
            '#656d78',
            'color: deeppink; font-weight: bold; text-decoration: underline',
            '#656d78'
        ]
    });
});

test('It should be able to validate the length of the types;', t => {
    const ast = splitTypeDeclaration('String → String → String');
    t.is(u.validateLength(ast, ['String', 'String'], ['Adam', 'Maria']), null);
    t.is(u.validateLength(ast, ['String', 'void'], ['Adam']), null);
    t.is(u.validateLength(ast, ['String', 'void|String'], ['Adam']), null);
    t.is(u.validateLength(ast, ['void|Number', 'void|String'], []), null);
    t.deepEqual(u.validateLength(ast, ['String', 'String'], ['Adam']), {
        valid: false,
        reports: [],
        generics: {},
        error: {
            ast: {
                name: null,
                types: [['String'], ['String'], ['String']],
                aliases: {},
                generics: [],
                declaration: 'String → String → String'
            },
            expected: 2,
            actual: 1
        }
    });
    t.deepEqual(u.validateLength(ast, ['String'], ['Adam', 'Maria']), {
        valid: false,
        reports: [],
        generics: {},
        error: {
            ast: {
                name: null,
                types: [['String'], ['String'], ['String']],
                aliases: {},
                generics: [],
                declaration: 'String → String → String'
            },
            expected: 1,
            actual: 2
        }
    });
});

test('It should be able to get the input and output types', t => {
    t.deepEqual(u.getInputTypes(['String', 'Number', 'Date']), ['String', 'Number']);
    t.deepEqual(u.getOutputTypes(['String', 'Number', 'Date']), ['Date']);
});

test('It should be able to pluralise words;', t => {
    t.is(u.pluralise('declaration', 0), 'declarations');
    t.is(u.pluralise('declaration', 1), 'declaration');
    t.is(u.pluralise('declaration', 2), 'declarations');
});

test('It should be able to format the type mismatch and length messages;', t => {
    t.is(
        u.formatTypeMismatchMessage(['String'], 'Number', 'Array(String) → Date → String'),
        'Expected String in `Array(String) → Date → String` declaration but received Number.'
    );
    t.is(
        u.formatTypeMismatchMessage(
            ['String'],
            'Number',
            'Array(String) → Date → String',
            'Array values must be of a single type'
        ),
        'Expected String in `Array(String) → Date → String` declaration but received Number (Array values must be of a single type).'
    );
    t.is(
        u.formatLengthMismatchMessage(3, 2, 'Number → String → Date'),
        'Expected 3 function parameters but received 2 parameters in `Number → String → Date`.'
    );
});
