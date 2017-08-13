module.exports = {
  rules: {
    'enforce-i18n-keys': require('./lib/rules/enforce-i18n-keys'),
    'no-block-arrow-callbacks': require('./lib/rules/no-block-arrow-callbacks'),
    'no-disallowed-props': require('./lib/rules/no-disallowed-props'),
  }
}
