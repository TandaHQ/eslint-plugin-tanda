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
          if (componentName !== 'FormattedTime' && componentName !== 'FormattedDate') {
            return;
          }

          const propNames = node
            .openingElement
            .attributes
            .map(a => a.name)
            .filter(Boolean)
            .map(n => n.name.toLowerCase());

          if (propNames.includes('timezone')) { return; }

          context.report({
            node,
            message: `You must provide a timeZone to ${componentName}`,
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
