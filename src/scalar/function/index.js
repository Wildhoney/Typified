import { splitTypeDeclaration } from '../../parser/index.js';
import { typeDeclaration } from '../../utils.js';

export default function validateFunction(validatorFn, ast, fn, generics) {
    const sourceAst = splitTypeDeclaration(ast.declaration);
    const destinationAst = splitTypeDeclaration(fn[typeDeclaration]);

    void sourceAst;
    void destinationAst;

    return { valid: true };
}
