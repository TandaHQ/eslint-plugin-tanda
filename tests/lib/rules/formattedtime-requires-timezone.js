const rule = require('../../../lib/rules/formattedtime-requires-timezone');
const { RuleTester } = require('eslint');

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
ruleTester.run('formattedtime-requires-timezone', rule, {
  valid: [
    {
      code: '<FormattedTime timezone="my text" />',
    },
    {
      code: '<FormattedTime timezone="my text" otherProp={true} />',
    },
    {
      code: '<FormattedTime otherProp={true} timezone="my text" />',
    },
    {
      code: '<FormattedTime otherProp={true} timeZone="my text" />',
    },
  ],

  invalid: [
    {
      code: '<FormattedTime foo="bar" />',
      errors: [{
        message: 'You must provide a `timezone` to the `FormattedTime` component',
      }],
    },
  ],
});
