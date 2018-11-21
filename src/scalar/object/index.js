import { splitTopLevel } from '../../parser/utils.js';
import * as u from "./utils.js"

export function isValueValid(validatorFn, ast, model, generics) {
    const initial = { valid: true, generics };
    const typeMap = u.getTypeMap(ast.declaration);

    if (Object.keys(model).length !== Object.keys(typeMap).length) {
        return { valid: false };
    }

    return Object.entries(model).reduce((accum, [key, value]) => {
        if (!typeMap[key]) {
            return { valid: false };
        }

        const types = splitTopLevel(typeMap[key], '|');
        const result = validatorFn(types, value, generics);

        return {
            valid: accum.valid && result.valid,
            generics: result.generics
        };
    }, initial);
}


export function isTypeValid(validatorFn, targetDeclarations, sourceDeclaration) {

    const sourceMap = u.getTypeMap(sourceDeclaration);
    
    const result = Object.entries(sourceMap).map(([key, value], index) => {
        
        const targetMap = u.getTypeMap(targetDeclarations[index]);
        // const valid = validatorFn(sourceMap, )

        return Object.entries(targetMap).every(([key, value],index) => {

            console.log(value)

            // const sourceType = splitTopLevel(sourceMap[key], '|')
            // const targetType = splitTopLevel(value,'|')

            // console.log( targetType)

        })

        console.log(targetMap, sourceMap)
        // const targetTypeMap = u.getTypeMap(targetDeclaration);


    });

    console.log(result);

    return true;
    // return validatorFn(sourceType, targetTypes);
}

