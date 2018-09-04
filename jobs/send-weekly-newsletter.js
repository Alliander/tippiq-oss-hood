import BPromise from 'bluebird';
import debugLogger from 'debug-logger';
import { knex } from '../api/common/bookshelf';
import sendWeeklyNewsletter from '../api/modules/newsletter/send-weekly-newsletter';
import { getHighlightAreaHtmlString } from '../api/modules/weekly-notifications/feed-parser';
import { rssHighlightWeeklyUrl } from '../api/config';

const debug = debugLogger('tippiq-hood:jobs:send-weekly-newsletter');

BPromise
  .try(() => getHighlightAreaHtmlString(rssHighlightWeeklyUrl))
  .then(sendWeeklyNewsletter)
  .tap(result => debug.info('%j', { success: true, result }))
  .tapCatch(err => debug.error('%j', { success: false, error: err.message }, err))
  .catch(() => {
    process.exitCode = 1;
  })
  .finally(() => {
    knex.destroy();
  });
