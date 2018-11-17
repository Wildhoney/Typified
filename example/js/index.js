import ꓽ from '/vendor/index.js';

const getHello =
    ꓽ `String → Number → String`
    ((name, age) => `${name}! Goodness me you are ${age}!`);

const printAdam =
    ꓽ `(String → Number|String → String) → void`
    (helloFn => console.log(helloFn('Adam', 33)));

printAdam(getHello);
