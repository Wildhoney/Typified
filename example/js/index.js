import ꓽ from '/vendor/index.js';

const getHello =
    ꓽ `String -> Number -> String`
    ((name, age) => `${name}! Goodness me you are ${age}!`);

console.log(getHello('Adam', 33))

// const printHello = 
//     ꓽ `forall a b. a -> ƒ(a -> Number -> String) -> void`
//     ((name, sayHello) => console.log(sayHello(name, 33)));

// printHello('Adam', getHello);