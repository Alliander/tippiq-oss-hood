import nock from 'nock';
import { expect } from '../../test/test-utils';
import { getHighlightAreaHtmlString } from './feed-parser';
import { rssHighlightWeeklyUrl } from '../../config';

const baseUrl = 'https://www.tippiq.nl';

const response1item = `
<item>
<title>test</title>
<link>https://www.tippiq.nl/test/</link>
<comments>https://www.tippiq.nl/test/#respond</comments>
<pubDate>Thu, 14 Mar 2013 13:27:20 +0000</pubDate>
<dc:creator><![CDATA[tippiq]]></dc:creator>
<category><![CDATA[MarComBuurtbericht]]></category>
<guid isPermaLink="false">https://www.tippiq.nl/?p=496</guid>
<description><![CDATA[test]]></description>
<content:encoded><![CDATA[<p>test</p>]]></content:encoded>
<wfw:commentRss>https://www.tippiq.nl/test/feed/</wfw:commentRss>
<slash:comments>0</slash:comments>
</item>`;

const response2items = `<item>
<title>test2</title>
<link>https://www.tippiq.nl/test2/</link>
<comments>https://www.tippiq.nl/test2/#respond</comments>
<pubDate>Thu, 14 Mar 2013 13:27:20 +0000</pubDate>
<dc:creator><![CDATA[tippiq]]></dc:creator>
<category><![CDATA[MarComBuurtbericht]]></category>
<guid isPermaLink="false">https://www.tippiq.nl/?p=496</guid>
<description><![CDATA[test2]]></description>
<content:encoded><![CDATA[<p>test2</p>]]></content:encoded>
<wfw:commentRss>https://www.tippiq.nl/test2/feed/</wfw:commentRss>
<slash:comments>0</slash:comments>
</item>
<item>
<title>test</title>
<link>https://www.tippiq.nl/test/</link>
<comments>https://www.tippiq.nl/test/#respond</comments>
<pubDate>Thu, 14 Mar 2013 13:19:24 +0000</pubDate>
<dc:creator><![CDATA[tippiq]]></dc:creator>
<category><![CDATA[MarComBuurtbericht]]></category>
<guid isPermaLink="false">https://www.tippiq.nl/?p=494</guid>
<description><![CDATA[test]]></description>
<content:encoded><![CDATA[<p>test</p>]]></content:encoded>
<wfw:commentRss>https://www.tippiq.nl/test/feed/</wfw:commentRss>
<slash:comments>0</slash:comments>
</item>`;

/**
 * Returns the RSS feed with optionally passed items
 * @function getRssFeed
 * @param {Array} items The RSS items
 * @returns {string} A string of XML that represents a RSS Feed
 */
function getRssFeed(items) {
  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:wfw="http://wellformedweb.org/CommentAPI/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:sy="http://purl.org/rss/1.0/modules/syndication/" xmlns:slash="http://purl.org/rss/1.0/modules/slash/">
    <channel>
      <title>MarComBuurtbericht &#8211; Tippiq</title>
      <atom:link href="https://www.tippiq.nl/category/MarComBuurtbericht/feed/" rel="self" type="application/rss+xml" />
      <link>https://www.tippiq.nl</link>
      <description></description>
      <lastBuildDate>Tue, 14 Mar 2017 11:39:00 +0000</lastBuildDate>
      <language>nl</language>
      <sy:updatePeriod>hourly</sy:updatePeriod>
      <sy:updateFrequency>1</sy:updateFrequency>
      <generator>https://wordpress.org/?v=4.7.3</generator>
      ${items}
    </channel>
  </rss>`;
}

describe('the highlight content html', () => {
  it('should return a html string if there is one item in the feed', () => {
    nock(baseUrl)
      .get('/category/MarComBuurtbericht/feed')
      .reply(200, getRssFeed([response1item]), { 'Content-Type': 'application/xml' },
      );
    return getHighlightAreaHtmlString(rssHighlightWeeklyUrl)
      .then(result =>
        Promise.all([
          expect(result).to.be.a('string'),
          expect(result).to.equal('<p>test</p>'),
        ])
      );
  });
  it('should return the first item if multiple are available', () => {
    nock(baseUrl)
      .get('/category/MarComBuurtbericht/feed')
      .reply(200, getRssFeed(response2items), { 'Content-Type': 'application/xml' },
      );
    return getHighlightAreaHtmlString(rssHighlightWeeklyUrl)
      .then(result =>
        Promise.all([
          expect(result).to.be.a('string'),
          expect(result).to.equal('<p>test2</p>'),
        ])
      );
  });
  it('should return an empty string when no feed items are available', () => {
    nock(baseUrl)
      .get('/category/MarComBuurtbericht/feed')
      .reply(200, getRssFeed([]), { 'Content-Type': 'application/xml' },
      );
    return getHighlightAreaHtmlString(rssHighlightWeeklyUrl)
      .then(result =>
        Promise.all([
          expect(result).to.be.a('string'),
          expect(result).to.equal(''),
        ])
      );
  });
  it('should return an empty string if the feed is not available', () => {
    nock(baseUrl)
      .get('/category/MarComBuurtbericht/feed-non-existing')
      .reply(404, {}, { 'Content-Type': 'application/xml' },
      );
    return getHighlightAreaHtmlString(`${rssHighlightWeeklyUrl}-non-existing`)
      .then(result =>
        Promise.all([
          expect(result).to.be.a('string'),
          expect(result).to.equal(''),
        ])
      );
  });
});
