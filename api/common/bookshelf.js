/**
 * Bookshelf configuration.
 * @module common/bookshelf
 */

import bookshelf from 'bookshelf';
import knex from 'knex';
import knexPostgis from 'knex-postgis';
import debugLogger from 'debug-logger';
import config from '../config';
import knexPostgisExtensions from './knex-postgis-extensions';

const knexInstance = knex({
  client: 'pg',
  connection: config.databaseUrl,
});

const knexLog = debugLogger('tippiq-hood:knex:queries');
knexInstance.on('query', query => {
  knexLog.trace('%j', query);
});

knexInstance.st = knexPostgis(knexInstance);

knexInstance.postgisDefineExtras(knexPostgisExtensions);

export default bookshelf(knexInstance);
