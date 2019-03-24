/**
 * @fileoverview Enforce I18n keys are used as props on a React component
 * @author David Buchan-Swanson
 */


//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const stringArray = {
  type: 'array',
  items: { type: 'string' },
  uniqueItems: true,
};

module.exports = {
  meta: {
    docs: {
      description: 'Enforce I18n keys are used as props on a React component',
    },
    fixable: null,
    schema: [{
      type: 'object',
      properties: {
        components: stringArray,
        paths: stringArray,
      },
    }],
  },

  create(context) {
    const options = context.options[0] || {};
    const allowedComponents = options.components || [];
    const allowedPaths = options.paths || [];
    const allowedItems = [
      'className',
      'transitionName', // from react-css-transitions
    ].concat(options.ignoredProps || []);

    // variables should be defined here
    const enforceOn = [/name$/i, /label$/i, /text$/i, /title$/i];

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    function isNativeComponent(name) {
      return name[0] === name[0].toLowerCase() && !name.includes('.');
    }

    function checkVariable(node, defs) {
      return defs.some(def => def.node.type === 'VariableDeclarator' && def.node.init.type === 'Literal');
    }

    function verifyAttribute(node, scope, attribute) {
      switch (attribute.type) {
        case 'Literal':
          return true;
        case 'JSXExpressionContainer':
          return verifyAttribute(node, scope, attribute.expression);
        // eslint-disable-next-line no-case-declarations
        case 'Identifier':
          // find the name in the scope
          const item = scope.variables.find(v => v.name === attribute.name);
          if (!item && scope.upper !== null) {
            return verifyAttribute(node, scope.upper, attribute);
          }
          return checkVariable(node, item.defs);
        default:
          return false;
      }
    }

    function skipCheck(node) {
      if (allowedComponents.length === 0 && allowedPaths.length === 0) {
        return false;
      }
      const componentPath = context.getFilename();
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
        const objects = [name.object];
        while (true) { // eslint-disable-line no-constant-condition
          const next = objects[0].object;
          if (!next) {
            break;
          }
          objects.unshift(next);
        }
        const objectResult = objects.map((object) => {
          if (object.name) {
            return object.name;
          }
          return object.property.name;
        });
        return `${objectResult.join('.')}.${name.property.name}`;
      }
      return '';
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      JSXElement(node) {
        try {
          if (skipCheck(node)) {
            return;
          }

          const { attributes } = node.openingElement;
          const componentName = getComponentName(node.openingElement.name);
          const scope = context.getScope();
          attributes.forEach((attribute) => {
            if (!attribute.name) {
              return;
            }
            if (!attribute.value) {
              // if there's no attribute value, it's implicitly `true`
              // and can be ignored by this plugin (which only cares about string values)
              return;
            }
            const attributeName = attribute.name.name;
            const isAllowedItem = allowedItems.includes(attributeName);
            const isNative = isNativeComponent(componentName);
            if (isAllowedItem || isNative) {
              return;
            }
            const result = enforceOn.some(re => re.test(attribute.name.name));
            if (result) {
              // let's make sure the attribute has valid values
              const shouldReport = verifyAttribute(node, scope, attribute.value);
              if (shouldReport) {
                context.report({
                  node,
                  message: `Translated text required for \`${attributeName}\`` +
                                        ` prop in \`${componentName}\``,
                });
              }
            }
          });
        } catch (e) {
          /* eslint-disable no-console */
          console.log('error!', e);
          console.log(context.getSourceCode().text);
          /* eslint-enable */
        }
      },

    };
  },
};
