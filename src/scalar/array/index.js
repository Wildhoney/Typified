import { splitTopLevel } from '../../parser/utils.js';

export function validateArray(validatorFn, ast, collection, generics) {
    const initial = { valid: true, generics };

    return Array.isArray(collection)
        ? collection.reduce((accum, value) => {
              const types = splitTopLevel(ast.declaration, '|');
              const result = validatorFn(types, value, generics);
              return {
                  valid: accum.valid && result.valid,
                  generics: result.generics
              };
          }, initial)
        : { valid: false };
}
