/**
 * @fileoverview Prevents certain props from being used in react components
 * @author David Buchan-Swanson
 * heavily inspired by
 * https://github.com/yannickcr/eslint-plugin-react/blob/master/lib/rules/require-default-props.js
 */


//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Prevents certain props from being used in react components',
      recommended: false,
    },
    fixable: null,
    schema: [],
  },

  create(context) {
    const disallowed = {
      className: '`className` is not allowed. Position should be changed using a wrapper' +
        ' and styling should be done in the component',
      colour: '`colour` is not allowed. `color` should be used instead.',
    };

    const disallowedNames = Object.keys(disallowed);

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    // from https://github.com/yannickcr/eslint-plugin-react/blob/master/lib/rules/require-default-props.js
    function getPropertyName(node) {
      if (node.key || ['MethodDefinition', 'Property'].indexOf(node.type) !== -1) {
        return node.key.name;
      } else if (node.type === 'MemberExpression') {
        return node.property.name;
        // Special case for class properties
        // (babel-eslint@5 does not expose property name so we have to rely on tokens)
      } else if (node.type === 'ClassProperty') {
        const tokens = context.getFirstTokens(node, 2);
        return tokens[1] && tokens[1].type === 'Identifier' ? tokens[1].value : tokens[0].value;
      }
      return '';
    }

    function isPropTypes(node) {
      return getPropertyName(node) === 'propTypes';
    }

    // from https://github.com/yannickcr/eslint-plugin-react/blob/739ece15a8bda7b7b7e62ba3b49c4fe3bb435d82/lib/util/Components.js#L321

    function getReturnStatement(node) {
      if (
        (!node.value || !node.value.body || !node.value.body.body) &&
        (!node.body || !node.body.body)
      ) {
        return false;
      }

      const bodyNodes = (node.value ? node.value.body.body : node.body.body);

      let i = bodyNodes.length - 1;
      for (; i >= 0; i -= 1) {
        if (bodyNodes[i].type === 'ReturnStatement') {
          return bodyNodes[i];
        }
      }
      return false;
    }

    function getProperties(obj) {
      if (!obj || !obj.type || obj.type !== 'ObjectExpression') {
        return null;
      }
      return obj.properties;
    }

    function getName(prop) {
      if (!prop.name && !prop.key) {
        return null;
      }

      return prop.type === 'Identifier' ? prop.name : prop.key.name;
    }

    function findPropInProperties(properties) {
      return properties.filter(prop => disallowedNames.includes(getName(prop)));
    }

    function warnAbout(properties) {
      const notAllowed = findPropInProperties(properties);
      if (notAllowed) {
        notAllowed.forEach((notAllowedNode) => {
          const name = getName(notAllowedNode);
          const message = disallowed[name];
          context.report(
            notAllowedNode,
            message,
          );
        });
      }
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      MemberExpression(node) {
        if (!isPropTypes(node)) {
          return null;
        }
        if (node.parent.type === 'AssignmentExpression') {
          const expression = node.parent.right;
          if (!expression || expression.type !== 'ObjectExpression') {
            return null;
          }
          const properties = getProperties(expression);
          if (!properties) {
            return null;
          }
          return warnAbout(properties);
        }
        if (
          node.parent.type === 'MemberExpression'
          && node.parent.parent.type === 'AssignmentExpression'
        ) {
          return warnAbout([node.parent.property]);
        }
        return null;
      },

      MethodDefinition(node) {
        if (!node.static || node.kind !== 'get') {
          return;
        }

        if (!isPropTypes(node)) {
          return;
        }

        const returnStatement = getReturnStatement(node);
        if (!returnStatement || !returnStatement) {
          return;
        }

        const properties = getProperties(returnStatement.argument);
        if (!properties) {
          return;
        }
        warnAbout(properties);
      },

      ClassProperty(node) {
        if (!node.static || !node.value || !isPropTypes(node)) {
          return;
        }

        const properties = getProperties(node.value);
        if (!properties) {
          return;
        }

        warnAbout(properties);
      },
    };
  },
};
