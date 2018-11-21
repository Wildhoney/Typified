export default function validateFunction(validatorFn, ast, declaration, generics) {
    const initial = { valid: true, generics };
    const results = ast.types.reduce((accum, types, index) => {
        const result = declaration[index]
            .map(declarationType => validatorFn(types, declarationType, generics))
            .find(({ valid }) => valid) || { valid: false, generics };

        return {
            valid: accum.valid && result.valid,
            generics: result.generics
        };
    }, initial);

    return { valid: results.valid };
}
