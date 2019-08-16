//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Requires a timezone when using FormattedTime',
      recommended: false,
    },
    fixable: null,
    schema: [],
  },

  create(context) {
    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

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
          const componentName = getComponentName(node.openingElement.name);
          if (componentName !== 'FormattedTime') {
            return;
          }

          const { attributes } = node.openingElement;
          let shouldReport = true;
          attributes.forEach((attribute) => {
            if (!attribute.name) {
              return;
            }
            const attributeName = attribute.name.name;
            if (attributeName === 'timezone') {
              shouldReport = false;
            }
          });

          if (shouldReport) {
            context.report({
              node,
              message: 'You must provide a `timezone` to the `FormattedTime` component',
            });
          }
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
