/* eslint require-jsdoc: "off", func-names: "off" */
/**
 * Search filter module.
 * @module common/search-filter
 */

export const TYPES = Object.freeze({
  EXACT_MATCH: 'types.exact_match',
  SEARCH: 'types.search',
  DATE: 'types.date',
});

function equalFilter(columnName, input) {
  if (typeof input === 'undefined') {
    return null;
  }

  return {
    column: columnName,
    operator: '=',
    value: input,
  };
}

function searchFilter(columnName, input) {
  if (typeof input === 'undefined') {
    return null;
  }

  return {
    column: columnName,
    operator: 'ILIKE',
    value: `%${input}%`,
  };
}

function dateFilters(columnName, input) {
  const filters = [];

  if (typeof input === 'undefined') {
    return [];
  }

  const dates = input.split('...');

  if (dates[0]) {
    filters.push({
      column: columnName,
      operator: '>=',
      value: dates[0],
    });
  }

  if (dates[1]) {
    filters.push({
      column: columnName,
      operator: '<=',
      value: dates[1],
    });
  }

  return filters;
}


export function SearchFilter(columnName, value, type = TYPES.EXACT_MATCH) {
  this.value = value;
  this.columnName = columnName;
  this.type = type;
}

SearchFilter.prototype.createQueryProperties = function (columnName, input, type) {
  switch (type) {
    case TYPES.EXACT_MATCH:
      return [equalFilter(columnName, input)];

    case TYPES.SEARCH:
      return [searchFilter(columnName, input)];

    case TYPES.DATE:
      return dateFilters(columnName, input);

    default:
      return [];
  }
};

SearchFilter.prototype.getQueryProperties = function () {
  return this.createQueryProperties(this.columnName, this.value, this.type);
};
