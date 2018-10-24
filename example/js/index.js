import ꓽ from '/vendor/index.js';

const sayHello =
    ꓽ `forall a b. String s, Int i => a -> a`
    (name => `Hello ${name}!`);

console.log(sayHello('Adam'));
