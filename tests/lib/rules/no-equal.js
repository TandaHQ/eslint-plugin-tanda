/**
 * @fileoverview Disable the use of `equal`, specifically meant for QUnit tests
 * @author David
 */


//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-equal');
const { RuleTester } = require('eslint');


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run('no-equal', rule, {

  valid: [
    {
      code: 'strictEqual(1, 1)',
    },
    {
      code: "deepEqual([], ['probs not'])",
    },
  ],

  invalid: [
    {
      code: 'equal(1, 1)',
      errors: [{
        message: '`equal()` is not allowed. Maybe you want `strictEqual()` or `deepEqual()`.',
      }],
    },
  ],
});
