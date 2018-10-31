import handleArray from './array/index.js';
import handleFunction from './function/index.js';

const defaults = {
    Array: handleArray,
    ƒ: handleFunction
};

export default new Map(Object.entries(defaults));
