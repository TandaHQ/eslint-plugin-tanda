/**
 * @fileoverview Disable the use of `equals`, specifically meant for QUnit tests
 * @author David Buchan-Swanson
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "Disable the use of `equals`, specifically meant for QUnit tests",
            recommended: false
        },
        fixable: 'code',  // or "code" or "whitespace"
        schema: [],
    },

    create: function(context) {

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
            if (node.callee && node.callee.name === 'equals') {
              context.report({
                node: node.callee,
                message: '`equals()` is not allowed. Maybe you want `strictEquals()` or `deepEquals()`.',
                fix: (fixer) => fixer.replaceText(node.callee, 'strictEquals'),
              });
            }
          }

        };
    }
};
