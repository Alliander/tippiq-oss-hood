/**
* @method validate
* @param {Object} opts Options
* @returns {bool} value
*/
export default function validate(opts) {
  let invalid;
  Object.keys(opts).forEach(key => {
    const field = opts[key];
    if (!field.validate()) {
      invalid = true;
    }
    field.trim(field);
  });
  return !invalid;
}
