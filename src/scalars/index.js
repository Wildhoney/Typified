import handleArray from './array/index.js';

const defaults = {
    Array: handleArray
};

export default new Map(Object.entries(defaults));
