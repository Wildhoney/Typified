# Typified

> An experimental implementation of first class functional types using pure ES at runtime.

![Travis](http://img.shields.io/travis/Wildhoney/Typified.svg?style=for-the-badge)
&nbsp;
![npm](http://img.shields.io/npm/v/typified.svg?style=for-the-badge)
&nbsp;
![License MIT](http://img.shields.io/badge/license-mit-lightgrey.svg?style=for-the-badge)

**npm**: `npm install typified --save`

## Getting Started

```javascript
import ꓽꓽ from 'typified';

const sayHello = ꓽꓽ `String → String` (name => `Hello ${name}!`);
```
