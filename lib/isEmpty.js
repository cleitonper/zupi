/**
  * Used for check if a variable is empty
  * ----------------------------------------------------------------
  *                     Usage Example - Test Results
  * ----------------------------------------------------------------
  * isEmpty([])        true, empty array
  * isEmpty({})        true, empty object
  * isEmpty(null)      true
  * isEmpty(undefined) true
  * isEmpty("")        true, empty string
  * isEmpty('')        true, empty string
  * isEmpty(0)         false, number
  * isEmpty(false)     false, boolean
  * ----------------------------------------------------------------
  * @param value: any - value to be checked
**/

const isEmpty = (value) => {
  if (value === undefined || value === null) return true;

  if (
    typeof value === 'number'
    || typeof value === 'boolean'
  ) return false;

  if (
    (typeof value === 'string' || Array.isArray(value))
    && !value.length
  ) return true;

  if (
    typeof value === 'object'
    && !Object.keys(value).length
  ) return true;
};

module.exports = isEmpty;
