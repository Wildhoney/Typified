import * as parser from '../parser/index.js';
import * as u from "./utils.js";

export default function validate(declaration, parameters, generics = {}) {

    const ast = parser.splitTypeDeclaration(declaration);
    const initial={ generics, errors: [] }

    return parameters.reduce(
        (accum, parameter, index) => {

            // Handle the processing of the types.
            const actualType = parameter.constructor.name;
            const expectedType = [].concat(accum.generics[ast.types[index]] || ast.types[index]);
            const matchedType = expectedType.find(type => type === actualType);
            const genericType = expectedType.find(type => ast.generics.includes(type));

            // Ensure the type is valid and/or a generic type.
            const isTypeValid = Boolean(matchedType || genericType)
            const isGenericType = Boolean(genericType);
            
            // Setup the return for the `reduce` function.
            const generics = !isGenericType ? accum.generics : {...accum.generics, [genericType]: actualType}
            const errors = isTypeValid ? accum.errors : [...accum.errors, u.formatTypeMismatchMessage(actualType, expectedType, declaration)];

            return { ...accum, generics, errors };

        },
        initial
    );
}
