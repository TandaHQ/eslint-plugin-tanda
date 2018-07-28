/**
 * @fileoverview Expect that expect is called in jest tests
 * @author David Buchan-Swanson
 */


//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/expect-expect');

const parserOptions = {
  ecmaVersion: 8,
  sourceType: 'module',
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true,
  },
};

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });

ruleTester.run('expect-expect', rule, {
  valid: [
    // give me some code that won't trigger a warning
    "it('should pass', () => expect(''))",
    "it('should pass', () => { somePromise.then(() => expect(''))})",
  ],

  invalid: [
    {
      code: "it('should fail', () => {});",
      errors: [{
        message: 'Test has no assertions',
        type: 'CallExpression',
      }],
    },
  ],
});
