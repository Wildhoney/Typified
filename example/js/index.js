import ꓽ from '/vendor/index.js';

// const multiplyBy =
//     ꓽ `Number -> (Number -> Number)`
//     (a => b => a * b)
    
// const multiplyByTwo = multiplyBy(2);
// console.log(multiplyByTwo(5));

const sayHello =
    ꓽ `String -> Number -> String`
    ((name, age) => `${name}! Goodness me you are ${age}!`);

console.log(sayHello('Adam', 33));

// const flattenHello =
//     ꓽ `∀ a. Array(a) → a`
//     (parts => parts.join(' '));

// console.log(flattenHello(['Hello', "Adam", '!']));
