import ꓽ from '/vendor/index.js';

// const getName = ꓽ`Promise(String) -> Promise(String)`(async name => {
//     return 'Hello ' + (await name);
// });

// (async function main() {
//     console.log(await getName(Promise.resolve('Adam')));
// })();

const getHello =
    ꓽ `String → Number → String`
    ((name, age) => `Hello ${name}! Goodness me you are ${age}!`);

const printAdam =
    ꓽ `(String → Number → String) → void`
    (helloFn => console.log(helloFn('Adam', 33)));

printAdam(getHello);

window.t = ꓽ;
window.getName = ꓽ`String → String`(name => 'Hello ' + name);
console.log('%cWelcome to %cTypified. ', 'color: #434a54', 'color: #434a54; font-weight: bold');
console.log(
    '%cUse %c`t` %cto set types: %cconst getName = t %c`String → String` %c(name => name)',
    'color: #656d78',
    'color: deeppink',
    'color: #656d78',
    'color: deeppink',
    'color: green',
    'color: deeppink'
);
console.log(
    "%cAnd then call it with different types to test it: %cgetName(%c'Adam'%c) %cand %cgetName(%c33%c)",
    'color: #656d78',
    'color: deeppink',
    'color: green',
    'color: deeppink',
    'color: #656d78',
    'color: deeppink',
    'color: green',
    'color: deeppink'
);
