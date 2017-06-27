/**
 * @fileoverview Enforce I18n keys are used as props on a React component
 * @author David Buchan-Swanson
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/enforce-i18n-keys");
var RuleTester = require("eslint").RuleTester;

var parserOptions = {
  ecmaVersion: 8,
  sourceType: 'module',
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester({ parserOptions });
ruleTester.run("enforce-i18n-keys", rule, {

    valid: [{
        code: "<AllowedComponent name=\"my text\" />",
        options: [{ components: ["AllowedComponent"] }]
    }, {
        code: "<Component name=\"my text\" />",
        options: [{ paths: ["exempt.jsx"] }],
        filename: "exempt.jsx"
    }, {
        code: "<Component name=\"my text\" />",
        options: [{ paths: ["\\w+Exempt\\.jsx"] }],
        filename: "someExempt.jsx"
    }],

    invalid: [
        {
            code: "<Component name=\"my text\" something=\"allowed\" />",
            errors: [{
                message: "You must use translated text",
            }]
        },
        {
            code: "<Component someLabel=\"my text\" anotherName=\"allowed\" demoText=\"something\" />",
            errors: [{
                message: "You must use translated text",
            }, {
                message: "You must use translated text",
            }, {
                message: "You must use translated text",
            }]
        },
        {
            code: "const x = 'some value'; <Component name={x} label=\"my text\" />",
            errors: [{
                message: "You must use translated text",
            }, {
                message: "You must use translated text",
            }]
        },
        {
            code: `
            const x = "some string";
            function getComponent() {
                return <Component text={x} />
            }
            `,
            errors: [{
                message: "You must use translated text",
            }]
        }
    ]
});
