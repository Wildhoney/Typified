const ꓽꓽ = type => {
    return a => {
        return !isFunction(a)
            ? a
            : (...input) => {
                  validateInput(type, input);
                  // console.log('Called: ' + input[0].constructor.name);
                  const output = fn(...input);
                  validateOutput(type, output);
                  // console.log('Returned: ' + output.constructor.name);
                  return output;
              };
    };
};

const isFunction = ꓽꓽ `∀ a. a → Boolean` (a => typeof a === 'function');

const validateInput = ꓽꓽ `∀ a. String → [a] → Boolean` ((type, input) => {
    return true;
})

const validateOutput = ꓽꓽ `∀ a. String → [a] → Boolean` ((type, input) => {
    return true;
})

export default ꓽꓽ;
