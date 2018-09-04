/**
 * Misc utils.
 * @module common/utils
 */

/**
 * Transform text to uppercase
 * @function uppercase
 * @param {string} input Text to transform
 * @returns {string} Uppercased text
 */
export function uppercase(input) {
  return input ? input.toUpperCase() : input;
}

/**
 * Map model to id
 * @function mapModelToId
 * @param {Object} model Model to get an id for
 * @returns {string} id of the model
 */
export function mapModelToId(model) {
  return model.get('id');
}

/**
 * Map models to ids
 * @function mapModelToIds
 * @param {Array} models Models to get an id for
 * @returns {object} the model to fetch the id for
 */
export function mapModelsToIds(models) {
  return models.map(mapModelToId);
}

/**
 * Get bookshelf options
 * @function bookshelfOptions
 * @param {Object} transaction Bookshelf transaction
 * @returns {Object} bookshelf options
 */
export function bookshelfOptions(transaction) {
  const options = {};
  if (transaction) {
    options.transacting = transaction;
  }
  return options;
}
