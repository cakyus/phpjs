
/**
 * Determine whether a variable is empty.
 *
 * A variable considered an empty when :
 *  - null
 *  - undefined
 *  - bool wich is false
 *  - string with zero length
 *  - number which is zero
 *  - array with zero elements
 *  - object with zero properties
 *
 * @param mixed var
 * @return bool
 */

function empty(value) {
  // type: undefined, object, boolean, number, bigint, string
  //   , symbol, function, object
  const type = typeof(value);
  if (type == 'object') {
    // null is an object
    if (Object.is(value, null)) {
      return true;
    }
    if (Object.keys(value).length == 0) {
      return true;
    }
    return false;
  } else if (Object.is(value, undefined)) {
    return true;
  } else if (type == 'string') {
    if (value.length == 0) {
      return true;
    }
    return false;
  } else if (type == 'boolean') {
    if (value === true) {
      return false;
    }
    return true;
  } else if (type == 'number') {
    if (value === 0) {
      return true;
    }
    return false;
  }

  throw new Error('Type '+type+' is invalid');
}

export { empty };
  
