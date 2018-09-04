/**
 * Config.
 * @module config
 */
const _ = require('lodash');

module.exports = _.defaults({},
  {
    host: process.env.HOST,
    port: process.env.PORT,
    apiHost: process.env.HOST,
    apiPort: process.env.APIPORT,
  },
  {
    host: 'localhost',
    port: '3007',
    apiHost: 'localhost',
    apiPort: '3008',
  });
