/**
 * @fileoverview Prevents the className prop from being used in react components
 * @author David Buchan-Swanson
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-disallowed-props"),

    RuleTester = require("eslint").RuleTester;

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
ruleTester.run("no-disallowed-props", rule, {

    valid: [
        {
            code: `Component.propTypes = { color: PropTypes.string }`
        },
        {
            code: `
            class Component extends React.Component {
                static propTypes = {
                    someProp: PropTypes.string,
                    color: PropTypes.any
                }
            }
            `,
            parser: 'babel-eslint',
        }
    ],

    invalid: [
        {
            code: `
            function Component(props) { return <p className={props.className} />}
            Component.propTypes = { className: PropTypes.string }`,
            errors: [{
                message: "`className` is not allowed. Position should be changed using a wrapper and styling should be done in the component"
            }]
        },
        {
            code: `
            function Component(props) { return <p className={props.className} />}
            Component.propTypes = {}
            Component.propTypes.className = PropTypes.string
            `,
            errors: [{
                message: "`className` is not allowed. Position should be changed using a wrapper and styling should be done in the component"
            }]
        },
        {
            code: `
            function Component(props) { return <p className={props.className} />}
            Component.propTypes = {}
            Component.propTypes.colour = PropTypes.string
            `,
            errors: [{
                message: "`colour` is not allowed. `color` should be used instead."
            }]
        },
        {
            code: `
            function Component(props) { return <p className={props.className} />}
            Component.propTypes = {}
            Component.propTypes.colour = PropTypes.string
            Component.propTypes.className = PropTypes.string
            `,
            errors: [{
                message: "`colour` is not allowed. `color` should be used instead."
            }, {
                message: "`className` is not allowed. Position should be changed using a wrapper and styling should be done in the component"
            }]
        },
        {
            code: `
            class Component extends React.Component {
                static get propTypes() {
                    return {
                        className: PropTypes.string
                    }
                }
            }
            `,
            errors: [{
                message: "`className` is not allowed. Position should be changed using a wrapper and styling should be done in the component"
            }]
        },
        {
            code: `
            class Component extends React.Component {
                static get propTypes() {
                    return {
                        colour: PropTypes.string
                    }
                }
            }
            `,
            errors: [{
                message: "`colour` is not allowed. `color` should be used instead."
            }]
        },
        {
            code: `
            class Component extends React.Component {
                static get propTypes() {
                    return {
                        colour: PropTypes.string,
                        className: PropTypes.string,
                    }
                }
            }
            `,
            errors: [{
                message: "`colour` is not allowed. `color` should be used instead."
            }, {
                message: "`className` is not allowed. Position should be changed using a wrapper and styling should be done in the component"
            }]
        },
        {
            code: `
            class Component extends React.Component {
                static propTypes = {
                    colour: PropTypes.string,
                    className: PropTypes.string,
                }
            }
            `,
            parser: 'babel-eslint',
            errors: [{
                message: "`colour` is not allowed. `color` should be used instead."
            }, {
                message: "`className` is not allowed. Position should be changed using a wrapper and styling should be done in the component"
            }]
        },
        {
            code: `
            class Component extends React.Component {
                static propTypes = {
                    colour: PropTypes.string,
                }
            }
            `,
            parser: 'babel-eslint',
            errors: [{
                message: "`colour` is not allowed. `color` should be used instead."
            }]
        },
        {
            code: `
            class Component extends React.Component {
                static propTypes = {
                    className: PropTypes.string,
                }
            }
            `,
            parser: 'babel-eslint',
            errors: [{
                message: "`className` is not allowed. Position should be changed using a wrapper and styling should be done in the component"
            }]
        }
    ]
});
