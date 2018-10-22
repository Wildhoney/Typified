# Typified

> An experimental implementation of first class functional types using pure ES at runtime.

## Getting Started

```javascript
import ꓽꓽ from 'typified';

const sayHello = ꓽꓽ `String → String` (name => `Hello ${name}!`);

// const Props = `Object(name: String, age: String, props: ${Props})`;

// const Name = `String`

// const welcome = ꓽꓽ `${Props} p, String s => p -> s` (name => `Hello ${name}!`)

// // const welcome = ꓽꓽ `forall a. String -> Object(name: a)` (name => `Hello ${name}!`)
```
