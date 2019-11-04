//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Pass a route (not a string) to attributes that take links (href, linkTo)',
      recommended: false,
    },
    fixable: null,
    schema: [],
  },

  create(context) {
    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    function verifyAttribute(node, attribute) {
      switch (attribute.type) {
        case 'Literal':
          return true;
        case 'JSXExpressionContainer':
          return verifyAttribute(node, attribute.expression);
        default:
          return false;
      }
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      JSXElement(node) {
        try {
          const { attributes } = node.openingElement;

          attributes.forEach((attribute) => {
            if (!attribute.name) {
              return;
            }
            if (!attribute.value) {
              // if there's no attribute value, it's implicitly `true`
              // and can be ignored by this plugin (which only cares about string values)
              return;
            }
            if (!['href', 'linkto'].includes(attribute.name.name.toLowerCase())) {
              return;
            }

            if (verifyAttribute(node, attribute.value)) {
              context.report({
                node,
                message: 'Pass a route (not a string) to attributes that take links (href, linkTo)',
              });
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
