/**
 * @fileoverview Prevents usage of fat arrows used with bodies in callbacks
 * @author Leon Pearce
 */

"use strict";

const rule = require("../../../lib/rules/no-block-arrow-callbacks");
const RuleTester = require("eslint").RuleTester;



// ------------------------------- FIXTURES -------------------------------- //

const good1 =
`
anArray
  .map(x => x + 10)
  .map(x => x - 9)
`

const good2 =
`
anArray
  .map(adds10)
  .map(minus9)
`

const good3 =
`
anArray
  .map(function add10(x) {
    return x + 10
  })
`

const bad1 =
`
anArray
  .map(x => {
    return x + 10
  })
`

const MESSAGE =
`
Do not use an arrow function as a callback with a block for a body!
use either an an arrow function with an expression body or define
your function, for code readability.

e.g.
  // good examples
  anArray.map(x => x + 10)
  anArray.map(addTen)

  // bad examples
  anArray.map(x => {
    if (x > 10) {
      return x - 10
    }

    return x + 10
  })
`



// ------------------------------- RUN SUITE ------------------------------- //

const parserOptions = {
  ecmaVersion: 8,
  sourceType: 'module',
};

new RuleTester({ parserOptions }).run("no-block-arrow-callbacks", rule, {
  valid: [
    { code: good1 },
    { code: good2 },
    { code: good3 },
  ],
  invalid: [
    { code: bad1, errors: [{ message: MESSAGE }] },
  ]
});
