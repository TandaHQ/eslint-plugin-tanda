module.exports = {
  rules: {
    'enforce-i18n-keys': require('./lib/rules/enforce-i18n-keys'),
    'expect-expect': require('./lib/rules/expect-expect'),
    'no-disallowed-props': require('./lib/rules/no-disallowed-props'),
    'no-equals': require('./lib/rules/no-equal'),
    'formattedtime-requires-timezone': require('./lib/rules/formattedtime-requires-timezone'),
    'href-string': require('./lib/rules/href-string'),
  },
  configs: {
    recommended: {
      /* text fields in react components must not be strings */
      "tanda/enforce-i18n-keys": 2,
      /* jest tests should call expect at least once */
      "tanda/expect-expect": 2,
      /* don't allow props like className and colour */
      "tanda/no-disallowed-props": 2,
      /* if you're using <FormattedTime> from react-intl you must provide a time zone */
      "tanda/formattedtime-requires-timezone": 2,
    },
  },
}
