import * as u from './utils.js';
import * as validate from './validate.js';

export default ([type]) => a =>
    !u.isFunction(a)
        ? a
        : (...input) => {
              const ast = u.parseType(type);
              const genericMap = validate.input(ast, input);
              const output = a(...input);
              validate.output(ast, output, genericMap);
              return output;
          };
