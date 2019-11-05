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

    function isAString(node, attribute) {
      switch (attribute.type) {
        case 'Literal':
          return true;
        case 'JSXExpressionContainer':
          return isAString(node, attribute.expression);
        default:
          return false;
      }
    }

    function whitelistedValue(attribute) {
      let val;
      if (attribute.expression) {
        val = attribute.expression.value;
      } else {
        val = attribute.value;
      }
      if (!val) { return false; }
      if (val === '#') { return true; }
      if (val.includes('http')) { return true; }
      return false;
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

            if (isAString(node, attribute.value) && !whitelistedValue(attribute.value)) {
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
