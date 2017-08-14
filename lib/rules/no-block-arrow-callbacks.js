/**
 * @fileoverview Prevents usage of fat arrows used with bodies in callbacks
 * @author Leon Pearce
 */

"use strict";

// -------------------------------- PLUGIN --------------------------------- //

module.exports = {

    meta: {
      docs: {
        description: 'disallow arrow function expression callbacks with a block statment as a body',
        category: 'Best Practices',
      },
      fixable: null,
      schema: [],
    },

    create(ctx) {
      return {
        'ArrowFunctionExpression:exit': noArrowBlockCallbacks(ctx),
      }
    }

  }



// -------------------------------- RULES ---------------------------------- //

/**
 * checks is function expression is an arrow function with a body positioned
 * as a callback.
 *
 * @param {*} node
 */
function noArrowBlockCallbacks(ctx) {
  return (node) => {
    if (hasBody(node) && isCallback(node)) {
      ctx.report({
        node,
        message: MESSAGE,
      })
    }
  }
}



// ------------------------------- HELPERS --------------------------------- //

/**
 * Evaluates if node is a callback
 */
function isCallback(node) {
  return node.parent.type === CALL_EXPRESSION ||
         node.parent.type === NEW_EXPRESSION
}

/**
 * Evaluates if a node has `BlockStatement` as a body type
 *
 * @param {Estree.Node} node
 * @returns {boolean} whether body type is a `BlockStatement`
 */
function hasBody(node) {
  return node.body.type === BLOCK_STATEMENT
}



// ------------------------------ CONSTANTS -------------------------------- //

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

const BLOCK_STATEMENT =
  "BlockStatement"

const CALL_EXPRESSION =
  "CallExpression"

const NEW_EXPRESSION =
  "NewExpression"
