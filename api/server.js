import express from 'express';
import debugLogger from 'debug-logger';
import api from './api';

const debug = debugLogger('tippiq-hood:api');

const app = express();

app.set('port', (process.env.API_PORT || 3008));

app.use('/api', api);

app.listen(app.get('port'), () => {
  console.log(`==> 🚧  Find the API server at: http://localhost:${app.get('port')} % proxied at :3007/api`); // eslint-disable-line no-console
  debug.info(`==> 🚧 Find the API server at: http://localhost:${app.get('port')}/ % proxied at :3007/api`);
});
