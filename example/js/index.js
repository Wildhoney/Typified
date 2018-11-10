import ꓽ from '/vendor/index.js';

const getHello =
    ꓽ `Object(name: String, age: Number) -> String`
    (model => `${model.name}! Goodness me you are ${model.age}!`);

console.log(getHello({ name: 'Adam', age: 33 }))

// const printHello = 
//     ꓽ `forall a b. a -> ƒ(a -> Number -> String) -> void`
//     ((name, sayHello) => console.log(sayHello(name, 33)));

// printHello('Adam', getHello);