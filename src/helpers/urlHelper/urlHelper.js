import { isObject, isArray } from 'lodash';

/**
 * @methodobjectToUrl
 * @param {Object} data Properties
 * @param {string} url Properties
 * @returns {string} url encoded url
 */
function objectToUrl(data, url) {
  if (!data || !url) return window.location.href;
  let newUrl = url;
  Object.keys(data).forEach((item, i) => {
    const currentItem = data[item];
    const param = (isObject(currentItem))
      ? encodeURIComponent(encodeURI(JSON.stringify(currentItem)))
      : encodeURIComponent(encodeURI(currentItem));
    if (param) {
      newUrl += `${item}=${param}${(i >= Object.keys(data).length - 1)
        ? '' : '&'}`;
    }
  });
  return newUrl;
}

/**
 * @method buildUrl
 * @param {string} param Properties
 * @returns {object} object from url / params
 */
function paramToObject(param) {
  const obj = {};
  const query = (document.location.search).replace(/(^\?)/, '').split('&').map(function getQuery(q) {
    let currentQuery = q;
    currentQuery = currentQuery.split('=');
    currentQuery = this[currentQuery[0]] = currentQuery[1];
    currentQuery = this;

    return currentQuery;
  }.bind({ item: param }))[0];
  if (Object.keys(query)[0] === '') delete query[''];

  Object.keys(query).forEach(item => {
    const currentItem = query[item];
    const temp = decodeURIComponent(decodeURI(currentItem));
    const newParam = (isObject(temp) || isArray(temp))
      ? JSON.parse(temp) : temp;
    obj[item] = newParam;
  });
  return obj;
}

export default {
  objectToUrl,
  paramToObject,
};
