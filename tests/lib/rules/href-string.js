const rule = require('../../../lib/rules/href-string');
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
ruleTester.run('href-string', rule, {
  valid: [
    {
      code: '<Foo href={Routes.bar_path()} />',
    },
    {
      code: '<Foo linkTo={Routes.bar_path()} />',
    },
    {
      code: '<Foo anyOtherPropIsIgnored={"cool"} />',
    },
    {
      code: '<Foo href={"https://www.google.com"} />', /* external links are fine */
    },
    {
      code: '<Foo href="#" />', /* weird but fine */
    },
  ],

  invalid: [
    {
      code: '<Foo href={"bar"} />',
      errors: [{
        message: 'Pass a route (not a string) to attributes that take links (href, linkTo)',
      }],
    },
    {
      code: '<Foo linkTo={"bar"} />',
      errors: [{
        message: 'Pass a route (not a string) to attributes that take links (href, linkTo)',
      }],
    },
  ],
});
