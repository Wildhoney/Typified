import handleArray from './array/index.js';
import handleObject from './object/index.js';

export default new Map(
    Object.entries({
        Array: handleArray,
        Object: handleObject
    })
);
