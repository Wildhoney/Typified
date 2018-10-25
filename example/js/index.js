import ꓽ from '/vendor/index.js';

const sayHello =
    ꓽ `String s ⇒ s → s`
    (name => `Hello ${name} !`);

const flattenHello =
    ꓽ `∀ a. Array(a) → a`
    (parts => parts.join(' '));

console.log(sayHello('Adam'));
console.log(flattenHello(['Hello', 'Adam', '!']));
