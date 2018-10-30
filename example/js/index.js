import ꓽ from '/vendor/index.js';


// const multiplyBy =
//     ꓽ `Number -> (Number -> Number)`
//     (a => b => a * b)
    
// const multiplyByTwo = multiplyBy(2);
// console.log(multiplyByTwo(5));

const sayHello =
    ꓽ `String -> Array(String)`
    (name => [`Hello ${name} !`]);

console.log(sayHello('Adam'));

// const flattenHello =
//     ꓽ `∀ a. Array(a) → a`
//     (parts => parts.join(' '));

// console.log(flattenHello(['Hello', "Adam", '!']));
