/**
 * @fileoverview Disable the use of `equal`, specifically meant for QUnit tests
 * @author David Buchan-Swanson
 */


//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Disable the use of `equal`, specifically meant for QUnit tests',
      recommended: false,
    },
    fixable: 'code', // or "code" or "whitespace"
    schema: [],
  },

  create(context) {
    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    // any helper functions should go here or else delete this section

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {

      // give me methods
      CallExpression: (node) => {
        if (node.callee && node.callee.name === 'equal') {
          context.report({
            node: node.callee,
            message: '`equal()` is not allowed. Maybe you want `strictEqual()` or `deepEqual()`.',
            fix: fixer => fixer.replaceText(node.callee, 'strictEqual'),
          });
        }
      },

    };
  },
};
