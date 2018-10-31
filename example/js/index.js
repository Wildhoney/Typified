import ꓽ from '/vendor/index.js';

const sayHello =
    ꓽ `String -> Number -> String`
    ((name, age) => `${name}! Goodness me you are ${age}!`);

console.log(sayHello('Adam', 33));

// const getHello =
//     ꓽ `String -> Number -> String`
//     ((name, age) => `${name}! Goodness me you are ${age}!`);

// const printHello = 
//     ꓽ `forall a b. a -> ƒ(a -> Number -> String) -> void`
//     ((name, sayHello) => console.log(sayHello(name, 33)));

// printHello('Adam', getHello);