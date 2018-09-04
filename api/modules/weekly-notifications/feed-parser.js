import feedParser from 'feedparser-promised';
import debugLogger from 'debug-logger';
import { isArray, has } from 'lodash';

const debug = debugLogger('tippiq-hood:newsletter:feed-parser');

/**
 * Get the highlight area html string to use in the weekly notification
 * @param {string} uri RSS uri to fetch
 * @return {Promise} Html string
 */
export function getHighlightAreaHtmlString(uri) {
  return feedParser.parse({ uri, rejectUnauthorized: false })
    .then(feedItems => {
      if (!isArray(feedItems)) {
        debug.warn('Highlight content is not an array, returning empty string.');
        return '';
      }
      if (feedItems.length === 0) {
        debug.trace(`No highlight content found for url: ${uri}, returning empty string`);
        return '';
      }
      if (feedItems.length > 1) {
        debug.trace(`Multiple feed items for url: ${uri} found. First item will be used.`);
      }
      if (!has(feedItems[0], 'description')) {
        debug.warn('Highlight content does not have description property, returning empty string');
        return '';
      }
      return feedItems[0].description;
    })
    .catch(err => {
      debug.error(`Error occurred while fetching feed, returning empty string. Error: ${err}`);
      return '';
    });
}
