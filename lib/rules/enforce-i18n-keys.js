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

        const allowedItems = ['className']
        const enforceOn = [/name$/i, /label$/i, /text$/i, /title$/i];

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        function report(node) {
            context.report({ message: 'You must use translated text', node });
        }

        function isNativeComponent(name) {
            return name[0] === name[0].toLowerCase() && !name.includes('.');
        }

        function checkVariable(node, identifiers) {
            let shouldReport = false;
            identifiers.forEach(id => {
                const parent = id.parent;
                switch (parent.type) {
                    case "VariableDeclarator":
                        if (parent.init && parent.init.type === "Literal") {
                            shouldReport = true;
                        }
                }
            });
            return shouldReport;
        }

        function verifyAttribute(node, scope, attribute) {
            switch (attribute.type) {
                case "Literal":
                    return true;
                case "JSXExpressionContainer":
                    return verifyAttribute(node, scope, attribute.expression);
                case "Identifier":
                    const name = attribute.name;
                    // find the name in the scope
                    const item = scope.variables.find(v => v.name === name);
                    if (!item && scope.upper !== null) {
                        return verifyAttribute(node, scope.upper, attribute);
                    }
                    return checkVariable(node, item.identifiers);
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

        function getComponentName(name) {
            if (typeof name.name === 'string') {
                return name.name;
            }
            if (name.type === 'JSXMemberExpression') {
                let objects = [name.object];
                while (true) {
                    const next = objects[0].object;
                    if (!next) {
                        break;
                    }
                    objects.unshift(next);
                }
                let objectResult = objects.map(object => {
                    if (object.name) {
                        return object.name;
                    }
                    return object.property.name;
                })
                return `${objectResult.join('.')}.${name.property.name}`
            }
        }

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {
            JSXElement: function (node) {
                try {
                    if (skipCheck(node)) {
                        return;
                    }
                    var attributes = node.openingElement.attributes;
                    var componentName = getComponentName(node.openingElement.name);
                    var scope = context.getScope();
                    attributes.forEach((attribute) => {
                        if (!attribute.name) {
                            return;
                        }
                        var attributeName = attribute.name.name;
                        var isAllowedItem = allowedItems.includes(attributeName);
                        var isNative = isNativeComponent(componentName)
                        if (isAllowedItem || isNative) {
                            return;
                        }
                        var result = enforceOn.some(re => re.test(attribute.name.name))
                        if (result) {
                            // let's make sure the attribute has valid values
                            const shouldReport = verifyAttribute(node, scope, attribute.value);
                            if (shouldReport) {
                                context.report({
                                    node,
                                    message: `Translated text required for \`${attributeName}\`` +
                                        ` prop in \`${componentName}\``
                                })
                            }
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
