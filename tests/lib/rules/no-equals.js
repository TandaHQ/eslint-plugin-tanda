/**
 * @fileoverview Disable the use of `equals`, specifically meant for QUnit tests
 * @author David
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-equals"),

    RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-equals", rule, {

    valid: [
      {
        code: "strictEquals(1, 1)",
      },
      {
        code: "deepEquals([], ['probs not'])"
      },
    ],

    invalid: [
        {
            code: "equals(1, 1)",
            errors: [{
                message: "`equals()` is not allowed. Maybe you want `strictEquals()` or `deepEquals()`.",
            }]
        }
    ]
});
