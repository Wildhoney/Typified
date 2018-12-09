import test from 'ava';
import { spy, match } from 'sinon';
import { splitTypeDeclaration } from '../../parser/index.js';
import validatorFn from '../../validator/index.js';
import createReporter from '../index.js';
import { isFunction } from '../../utils.js';
import * as u from '../utils.js';

test.beforeEach(t => {
    t.context.throwSpy = u.throwPrettyError = spy();
});

test('It should be able to create a valid validation report;', t => {
    const declaration = 'String → Number → Date';
    const ast = splitTypeDeclaration(declaration);
    const validator = validatorFn(ast);
    const reporter = createReporter(ast, validator);
    const outputReporter = reporter(['Adam', 33]);
    t.true(isFunction(outputReporter));
    t.is(outputReporter(new Date('10/10/1985')), null);
});

test('It should be able to create a invalid validation report on length mismatch;', t => {
    const declaration = 'String → Number → Date';
    const ast = splitTypeDeclaration(declaration);
    const validator = validatorFn(ast);
    const reporter = createReporter(ast, validator);
    reporter(['Adam']);
    t.is(t.context.throwSpy.callCount, 1);
    t.true(t.context.throwSpy.calledWith(u.errorTypes.LENGTH_MISMATCH, match.object, match.object));
});

test('It should be able to create a invalid validation report on length mismatch with void types;', t => {
    const declaration = 'String → Number|void → Date';
    const ast = splitTypeDeclaration(declaration);
    const validator = validatorFn(ast);
    const reporter = createReporter(ast, validator);
    reporter(['Adam']);
    t.is(t.context.throwSpy.callCount, 0);
    reporter(['Adam', 33]);
    t.is(t.context.throwSpy.callCount, 0);
    reporter(['Adam', 33, new Date('10/10/1995')]);
    t.true(t.context.throwSpy.calledWith(u.errorTypes.LENGTH_MISMATCH, match.object, match.object));
});

test('It should be able to create a invalid validation report on type mismatch;', t => {
    const declaration = 'String → Number → Date';
    const ast = splitTypeDeclaration(declaration);
    const validator = validatorFn(ast);
    const reporter = createReporter(ast, validator);
    reporter(['Adam', new Date('10/10/1985')]);
    t.is(t.context.throwSpy.callCount, 1);
    t.true(t.context.throwSpy.calledWith(u.errorTypes.TYPE_MISMATCH, match.object, match.object));
});

test('It should be able to create a invalid validation report on type mismatch with promise;', async t => {
    const declaration = 'Promise(String) → Promise(Number) → Promise(Date)';
    const ast = splitTypeDeclaration(declaration);
    const validator = validatorFn(ast);
    const reporter = createReporter(ast, validator);
    await reporter([Promise.resolve('Adam'), Promise.resolve(new Date('10/10/1985'))]);
    t.is(t.context.throwSpy.callCount, 1);
    t.true(t.context.throwSpy.calledWith(u.errorTypes.TYPE_MISMATCH, match.object, match.object));
});
