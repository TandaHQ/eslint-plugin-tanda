/* eslint import/no-dynamic-require: 0, global-require: 0 */
const fs = require('fs');

fs.readdir('./lib/rules', (err, res) => {
  if (err) throw err;

  res.forEach(test => require(`./lib/rules/${test}`));
});
