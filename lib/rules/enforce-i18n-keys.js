/**
 * @fileoverview Enforce I18n keys are used as props on a React component
 * @author David Buchan-Swanson
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const stringArray = {
    type: "array",
    items: { type: "string" },
    uniqueItems: true,
}

module.exports = {
    meta: {
        docs: {
            description: "Enforce I18n keys are used as props on a React component",
        },
        fixable: null,
        schema: [{
            type: "object",
            properties: {
                components: stringArray,
                paths: stringArray,
            },
        }]
    },

    create: function(context) {

        const options = context.options[0] || {};
        const allowedComponents = options.components || []
        const allowedPaths = options.paths || []

        // variables should be defined here

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        function report(node) {
            context.report({ message: 'You must use translated text', node });
        }

        function checkVariable(node, identifiers) {
            identifiers.forEach(id => {
                const parent = id.parent;
                switch (parent.type) {
                    case "VariableDeclarator":
                        if (parent.init && parent.init.type === "Literal") {
                            report(node);
                        }
                }
            });
        }

        function verifyAttribute(node, scope, attribute) {
            switch (attribute.type) {
                case "Literal":
                    report(node);
                    break;
                case "JSXExpressionContainer":
                    verifyAttribute(node, scope, attribute.expression);
                    break;
                case "Identifier":
                    const name = attribute.name;
                    // find the name in the scope
                    const item = scope.variables.find(v => v.name === name);
                    if (!item && scope.upper !== null) {
                        verifyAttribute(node, scope.upper, attribute);
                        break;
                    }
                    checkVariable(node, item.identifiers);
            }
        }

        function skipCheck(node) {
            if (allowedComponents.length === 0 && allowedPaths.length === 0) {
                return false;
            }
            const componentPath = context.getFilename()
            if (allowedPaths.some(path => (new RegExp(path)).test(componentPath))) {
                return true;
            }
            return allowedComponents.includes(node.openingElement.name.name);
        }

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        const enforceOn = [/name$/i, /label$/i, /text$/i];

        return {

            JSXElement: function (node) {
                try {
                if (skipCheck(node)) {
                    return;
                }
                var attributes = node.openingElement.attributes;
                var scope = context.getScope();
                attributes.forEach((attribute) => {
                    if (!attribute.name) {
                        return;
                    }
                    var result = enforceOn.some(re => re.test(attribute.name.name))
                    if (result) {
                        // let's make sure the attribute has valid values
                        verifyAttribute(node, scope, attribute.value);
                    }
                });
                } catch (e) {
                    console.log("error!", e);
                    console.log(context.getSourceCode().text);
                }
            }

        };
    }
};
