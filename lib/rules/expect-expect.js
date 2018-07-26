/**
 * based on https://github.com/tlvince/eslint-plugin-jasmine/blob/master/lib/rules/missing-expect.js
 * @fileoverview Expect that expect is called in jest tests
 * @author David Buchan-Swanson
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Expect that expect is called in jest tests',
      category: 'Fill me in',
      recommended: false,
    },
    fixable: null, // or "code" or "whitespace"
    schema: [
      // fill in your schema
    ],
  },

  create(context) {
    // variables should be defined here
    const unchecked = [];

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    const isExpectCall = node =>
      // if we're not calling a function, ignore
      node.type === 'CallExpression' &&
        // if we're not calling expect, ignore
        node.callee.name === 'expect';


    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      // give me methods
      CallExpression(node) {
        // keep track of `it` calls
        if (node.callee.name === 'it') {
          unchecked.push(node);
          return;
        }

        if (!isExpectCall(node)) {
          return;
        }

        // here, we do have a call to expect
        // use `some` to return early (in case of nested `it`s
        context.getAncestors().some((ancestor) => {
          const index = unchecked.indexOf(ancestor);

          if (index !== -1) {
            unchecked.splice(index, 1);
            return true;
          }

          return false;
        });
      },

      'Program:exit': () => {
        unchecked.forEach(node => context.report({
          message: 'Test has no assertions',
          node,
        }));
      },
    };
  },
};
