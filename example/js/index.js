import ꓽ from '/vendor/index.js';

const getHello =
    ꓽ `String -> Number -> String`
    ((name, age) => `${name}! Goodness me you are ${age}!`);

console.log(getHello('Adam', 33));
