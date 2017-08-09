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
    valid: [
        {
            code: "<AllowedComponent name=\"my text\" />",
            options: [{ components: ["AllowedComponent"] }]
        },
        {
            code: "<Component name=\"my text\" />",
            options: [{ paths: ["exempt.jsx"] }],
            filename: "exempt.jsx"
        },
        {
            code: "<Component name=\"my text\" />",
            options: [{ paths: ["\\w+Exempt\\.jsx"] }],
            filename: "someExempt.jsx"
        },
        {
            code: "<Component {...rest} />"
        },
        {
            code: `
            const x = t('some.translation.key');
            <Component name={x} />
            `
        },
        {
            code: "<Component className=\"something\" />"
        },
        {
            code: "<Component className={someVariable} />"
        },
        {
            code: "<div itemName=\"something\" />"
        }
    ],

    invalid: [
        {
            code: "<Component name=\"my text\" something=\"allowed\" />",
            errors: [{
                message: "Translated text required for `name` prop in `Component`",
            }]
        },
        {
            code: "<Component someLabel=\"my text\" anotherName=\"allowed\" demoText=\"something\" subTitle=\"beep boop\" />",
            errors: [{
                message: "Translated text required for `someLabel` prop in `Component`",
            }, {
                message: "Translated text required for `anotherName` prop in `Component`",
            }, {
                message: "Translated text required for `demoText` prop in `Component`",
            }, {
                message: "Translated text required for `subTitle` prop in `Component`",
            }]
        },
        {
            code: "const x = 'some value'; <Component name={x} label=\"my text\" />",
            errors: [{
                message: "Translated text required for `name` prop in `Component`",
            }, {
                message: "Translated text required for `label` prop in `Component`",
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
                message: "Translated text required for `text` prop in `Component`",
            }]
        },
        {
            code: `
            <window.Components.SubLevel.Another.SomeComponent label="text">
                Some Content
            </window.Components.SubLevel.Another.SomeComponent>
            `,
            errors: [{
                message: "Translated text required for `label`" +
                " prop in `window.Components.SubLevel.Another.SomeComponent`",
            }]
        }
    ]
});
