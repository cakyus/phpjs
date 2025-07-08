const PHP_INT_MAX = 9223372036854775807;

/**
 * Determine whether a variable is empty.
 *
 * A variable considered an empty when :
 *  - null
 *  - undefined
 *  - bool wich is false
 *  - string with zero length
 *  - number which is zero or less than zero
 *    - less than zero coz String.indexOf() return -1 when no match found
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
    if (value > 0) {
      return false;
    }
    return true;
  }

  throw new Error('Type '+type+' is invalid');
}

// Match filename against a pattern
//
// @param string pattern
// @param string filename
// @return bool
//
// "?"   match one char
// "*"   match zero or more chars
// "[ ]" match range of charaters
// "!"   negate charater in square brackets
// "\"   escape special characters

function fnmatch(pattern, filename) {

  const patterns = pattern.split('');
  const filenames = [ filename.split('') ];

  while (patterns.length > 0) {

    if (patterns[0] == '*') {

      if (patterns.length == 1) {
        // when asteric at the end of pattern
        // then ignore filenames and return true
        return true;
      }

      // add possible values into filenames
      // filenames ["abc","def"]
      // -> ["abc","bc","c","def","ef","f"]

      const filenames_length = filenames.length;
      for (let i=0; i < filenames_length; i++) {
        const filename_length = filenames[i].length;
        for (let j=1; j < filename_length; j++) {
          filenames.push(filenames[i].slice(j));
        }
      }

      patterns.shift();
      continue;
    } else if (patterns[0] == '?') {
      throw Error('TODO implement "?"');
    } else if (patterns[0] == '[' || patterns[0] == ']') {
      throw Error('TODO implement "[ ..]"');
    } else if (patterns[0] == '\\') {
      throw Error('TODO implement "\\"');
    }

    // compare pattern with filenames

    let filenames_length = filenames.length;

    for (let f=0; f < filenames_length; f++) {

      if (filenames[f][0] == patterns[0]) {
        // match
        if (patterns.length == 1) {
          // at the last char of pattern
          return true;
        }
        filenames[f] = filenames[f].slice(1);
      } else {
        // not match
        // remove filenames item at current index
        // f 0
        // filenames [b,c,d]
        // -> filenames [c,d]
        filenames.splice(f, 1);
        // set counter to previous index
        filenames_length = filenames_length - 1;
        f = f - 1;
        continue;
      }
    }

    // evaluate next char in the pattern
    patterns.shift();
  }

  return false;
}

// Return current Unix timestamp.
// @return int

function time() {
  // js Date.getTime return time in milliseconds.
  return Math.round( ( new Date ).getTime() / 1000 );
}

function date(format, time) {
  let chars = [];
  let date = new Date;
  for (let c of format.split('')) {
    if (c == 'Y') {
      c = date.getFullYear();
    } else if (c == 'm') {
      c = date.getMonth() + 1;
      if (c < 10) {
        c = '0' + c
      }
    } else if (c == 'd') {
      c = date.getDate();
      if (c < 10) {
        c = '0' + c
      }
    } else if (c == 'H') {
      c = date.getHours();
      if (c < 10) {
        c = '0' + c
      }
    } else if (c == 'i') {
      c = date.getMinutes();
      if (c < 10) {
        c = '0' + c
      }
    } else if (c == 's') {
      c = date.getSeconds();
      if (c < 10) {
        c = '0' + c
      }
    }
    chars.push(c);
  }
  return chars.join('');
}

// Gets the value of a single or all environment variables.
// @param string name
// @return string|false


// @param mixed value
// @return bool

function is_null(value) {
  if (Object.is(value, null) == true) {
    return true;
  } else if (Object.is(value, undefined) == true) {
    return true;
  }
  return false;
}

// Finds whether a variable is an array
// @param mixed value
// @return bool

function is_array(value) {
  return Array.isArray(value);
}

/**
 * array_change_key_case for phpjs
 */
function array_change_key_case (array, cs) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_change_key_case/
  // original by: Ates Goral (http://magnetiq.com)
  // improved by: marrtins
  // improved by: Brett Zamir (http://brett-zamir.me)
  //   example 1: array_change_key_case(42)
  //   returns 1: false
  //   example 2: array_change_key_case([ 3, 5 ])
  //   returns 2: [3, 5]
  //   example 3: array_change_key_case({ FuBaR: 42 })
  //   returns 3: {"fubar": 42}
  //   example 4: array_change_key_case({ FuBaR: 42 }, 'CASE_LOWER')
  //   returns 4: {"fubar": 42}
  //   example 5: array_change_key_case({ FuBaR: 42 }, 'CASE_UPPER')
  //   returns 5: {"FUBAR": 42}
  //   example 6: array_change_key_case({ FuBaR: 42 }, 2)
  //   returns 6: {"FUBAR": 42}
  var caseFnc
  var key
  var tmpArr = {}
  if (Object.prototype.toString.call(array) === '[object Array]') {
    return array
  }
  if (array && typeof array === 'object') {
    caseFnc = (!cs || cs === 'CASE_LOWER') ? 'toLowerCase' : 'toUpperCase'
    for (key in array) {
      tmpArr[key[caseFnc]()] = array[key]
    }
    return tmpArr
  }
  return false
}
/**
 * array_chunk for phpjs
 */
function array_chunk (input, size, preserveKeys) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_chunk/
  // original by: Carlos R. L. Rodrigues (http://www.jsfromhell.com)
  // improved by: Brett Zamir (http://brett-zamir.me)
  //      note 1: Important note: Per the ECMAScript specification,
  //      note 1: objects may not always iterate in a predictable order
  //   example 1: array_chunk(['Kevin', 'van', 'Zonneveld'], 2)
  //   returns 1: [['Kevin', 'van'], ['Zonneveld']]
  //   example 2: array_chunk(['Kevin', 'van', 'Zonneveld'], 2, true)
  //   returns 2: [{0:'Kevin', 1:'van'}, {2: 'Zonneveld'}]
  //   example 3: array_chunk({1:'Kevin', 2:'van', 3:'Zonneveld'}, 2)
  //   returns 3: [['Kevin', 'van'], ['Zonneveld']]
  //   example 4: array_chunk({1:'Kevin', 2:'van', 3:'Zonneveld'}, 2, true)
  //   returns 4: [{1: 'Kevin', 2: 'van'}, {3: 'Zonneveld'}]
  var x
  var p = ''
  var i = 0
  var c = -1
  var l = input.length || 0
  var n = []
  if (size < 1) {
    return null
  }
  if (Object.prototype.toString.call(input) === '[object Array]') {
    if (preserveKeys) {
      while (i < l) {
        (x = i % size)
          ? n[c][i] = input[i]
          : n[++c] = {}; n[c][i] = input[i]
        i++
      }
    } else {
      while (i < l) {
        (x = i % size)
          ? n[c][x] = input[i]
          : n[++c] = [input[i]]
        i++
      }
    }
  } else {
    if (preserveKeys) {
      for (p in input) {
        if (input.hasOwnProperty(p)) {
          (x = i % size)
            ? n[c][p] = input[p]
            : n[++c] = {}; n[c][p] = input[p]
          i++
        }
      }
    } else {
      for (p in input) {
        if (input.hasOwnProperty(p)) {
          (x = i % size)
            ? n[c][x] = input[p]
            : n[++c] = [input[p]]
          i++
        }
      }
    }
  }
  return n
}
/**
 * array_combine for phpjs
 */
function array_combine (keys, values) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_combine/
  // original by: Kevin van Zonneveld (http://kvz.io)
  // improved by: Brett Zamir (http://brett-zamir.me)
  //   example 1: array_combine([0,1,2], ['kevin','van','zonneveld'])
  //   returns 1: {0: 'kevin', 1: 'van', 2: 'zonneveld'}
  var newArray = {}
  var i = 0
  // input sanitation
  // Only accept arrays or array-like objects
  // Require arrays to have a count
  if (typeof keys !== 'object') {
    return false
  }
  if (typeof values !== 'object') {
    return false
  }
  if (typeof keys.length !== 'number') {
    return false
  }
  if (typeof values.length !== 'number') {
    return false
  }
  if (!keys.length) {
    return false
  }
  // number of elements does not match
  if (keys.length !== values.length) {
    return false
  }
  for (i = 0; i < keys.length; i++) {
    newArray[keys[i]] = values[i]
  }
  return newArray
}
/**
 * array_count_values for phpjs
 */
function array_count_values (array) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_count_values/
  // original by: Ates Goral (http://magnetiq.com)
  // improved by: Michael White (http://getsprink.com)
  // improved by: Kevin van Zonneveld (http://kvz.io)
  //    input by: sankai
  //    input by: Shingo
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  //   example 1: array_count_values([ 3, 5, 3, "foo", "bar", "foo" ])
  //   returns 1: {3:2, 5:1, "foo":2, "bar":1}
  //   example 2: array_count_values({ p1: 3, p2: 5, p3: 3, p4: "foo", p5: "bar", p6: "foo" })
  //   returns 2: {3:2, 5:1, "foo":2, "bar":1}
  //   example 3: array_count_values([ true, 4.2, 42, "fubar" ])
  //   returns 3: {42:1, "fubar":1}
  var tmpArr = {}
  var key = ''
  var t = ''
  var _getType = function (obj) {
    // Objects are php associative arrays.
    var t = typeof obj
    t = t.toLowerCase()
    if (t === 'object') {
      t = 'array'
    }
    return t
  }
  var _countValue = function (tmpArr, value) {
    if (typeof value === 'number') {
      if (Math.floor(value) !== value) {
        return
      }
    } else if (typeof value !== 'string') {
      return
    }
    if (value in tmpArr && tmpArr.hasOwnProperty(value)) {
      ++tmpArr[value]
    } else {
      tmpArr[value] = 1
    }
  }
  t = _getType(array)
  if (t === 'array') {
    for (key in array) {
      if (array.hasOwnProperty(key)) {
        _countValue.call(this, tmpArr, array[key])
      }
    }
  }
  return tmpArr
}
/**
 * array_diff_assoc for phpjs
 */
function array_diff_assoc (arr1) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_diff_assoc/
  // original by: Kevin van Zonneveld (http://kvz.io)
  // bugfixed by: 0m3r
  //  revised by: Brett Zamir (http://brett-zamir.me)
  //   example 1: array_diff_assoc({0: 'Kevin', 1: 'van', 2: 'Zonneveld'}, {0: 'Kevin', 4: 'van', 5: 'Zonneveld'})
  //   returns 1: {1: 'van', 2: 'Zonneveld'}
  var retArr = {}
  var argl = arguments.length
  var k1 = ''
  var i = 1
  var k = ''
  var arr = {}
  arr1keys: for (k1 in arr1) { // eslint-disable-line no-labels
    for (i = 1; i < argl; i++) {
      arr = arguments[i]
      for (k in arr) {
        if (arr[k] === arr1[k1] && k === k1) {
          // If it reaches here, it was found in at least one array, so try next value
          continue arr1keys // eslint-disable-line no-labels
        }
      }
      retArr[k1] = arr1[k1]
    }
  }
  return retArr
}
/**
 * array_diff for phpjs
 */
function array_diff (arr1) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_diff/
  // original by: Kevin van Zonneveld (http://kvz.io)
  // improved by: Sanjoy Roy
  //  revised by: Brett Zamir (http://brett-zamir.me)
  //   example 1: array_diff(['Kevin', 'van', 'Zonneveld'], ['van', 'Zonneveld'])
  //   returns 1: {0:'Kevin'}
  var retArr = {}
  var argl = arguments.length
  var k1 = ''
  var i = 1
  var k = ''
  var arr = {}
  arr1keys: for (k1 in arr1) { // eslint-disable-line no-labels
    for (i = 1; i < argl; i++) {
      arr = arguments[i]
      for (k in arr) {
        if (arr[k] === arr1[k1]) {
          // If it reaches here, it was found in at least one array, so try next value
          continue arr1keys // eslint-disable-line no-labels
        }
      }
      retArr[k1] = arr1[k1]
    }
  }
  return retArr
}
/**
 * array_diff_key for phpjs
 */
function array_diff_key (arr1) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_diff_key/
  // original by: Ates Goral (http://magnetiq.com)
  //  revised by: Brett Zamir (http://brett-zamir.me)
  //    input by: Everlasto
  //   example 1: array_diff_key({red: 1, green: 2, blue: 3, white: 4}, {red: 5})
  //   returns 1: {"green":2, "blue":3, "white":4}
  //   example 2: array_diff_key({red: 1, green: 2, blue: 3, white: 4}, {red: 5}, {red: 5})
  //   returns 2: {"green":2, "blue":3, "white":4}
  var argl = arguments.length
  var retArr = {}
  var k1 = ''
  var i = 1
  var k = ''
  var arr = {}
  arr1keys: for (k1 in arr1) { // eslint-disable-line no-labels
    for (i = 1; i < argl; i++) {
      arr = arguments[i]
      for (k in arr) {
        if (k === k1) {
          // If it reaches here, it was found in at least one array, so try next value
          continue arr1keys // eslint-disable-line no-labels
        }
      }
      retArr[k1] = arr1[k1]
    }
  }
  return retArr
}
/**
 * array_diff_uassoc for phpjs
 */
function array_diff_uassoc (arr1) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_diff_uassoc/
  // original by: Brett Zamir (http://brett-zamir.me)
  //   example 1: var $array1 = {a: 'green', b: 'brown', c: 'blue', 0: 'red'}
  //   example 1: var $array2 = {a: 'GREEN', B: 'brown', 0: 'yellow', 1: 'red'}
  //   example 1: array_diff_uassoc($array1, $array2, function (key1, key2) { return (key1 === key2 ? 0 : (key1 > key2 ? 1 : -1)) })
  //   returns 1: {b: 'brown', c: 'blue', 0: 'red'}
  //        test: skip-1
  var retArr = {}
  var arglm1 = arguments.length - 1
  var cb = arguments[arglm1]
  var arr = {}
  var i = 1
  var k1 = ''
  var k = ''
  var $global = (typeof window !== 'undefined' ? window : global)
  cb = (typeof cb === 'string')
    ? $global[cb]
    : (Object.prototype.toString.call(cb) === '[object Array]')
      ? $global[cb[0]][cb[1]]
      : cb
  arr1keys: for (k1 in arr1) { // eslint-disable-line no-labels
    for (i = 1; i < arglm1; i++) {
      arr = arguments[i]
      for (k in arr) {
        if (arr[k] === arr1[k1] && cb(k, k1) === 0) {
          // If it reaches here, it was found in at least one array, so try next value
          continue arr1keys // eslint-disable-line no-labels
        }
      }
      retArr[k1] = arr1[k1]
    }
  }
  return retArr
}
/**
 * array_diff_ukey for phpjs
 */
function array_diff_ukey (arr1) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_diff_ukey/
  // original by: Brett Zamir (http://brett-zamir.me)
  //   example 1: var $array1 = {blue: 1, red: 2, green: 3, purple: 4}
  //   example 1: var $array2 = {green: 5, blue: 6, yellow: 7, cyan: 8}
  //   example 1: array_diff_ukey($array1, $array2, function (key1, key2){ return (key1 === key2 ? 0 : (key1 > key2 ? 1 : -1)); })
  //   returns 1: {red: 2, purple: 4}
  var retArr = {}
  var arglm1 = arguments.length - 1
  // var arglm2 = arglm1 - 1
  var cb = arguments[arglm1]
  var k1 = ''
  var i = 1
  var arr = {}
  var k = ''
  var $global = (typeof window !== 'undefined' ? window : global)
  cb = (typeof cb === 'string')
    ? $global[cb]
    : (Object.prototype.toString.call(cb) === '[object Array]')
      ? $global[cb[0]][cb[1]]
      : cb
  arr1keys: for (k1 in arr1) { // eslint-disable-line no-labels
    for (i = 1; i < arglm1; i++) {
      arr = arguments[i]
      for (k in arr) {
        if (cb(k, k1) === 0) {
          // If it reaches here, it was found in at least one array, so try next value
          continue arr1keys // eslint-disable-line no-labels
        }
      }
      retArr[k1] = arr1[k1]
    }
  }
  return retArr
}
/**
 * array_fill for phpjs
 */
function array_fill (startIndex, num, mixedVal) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_fill/
  // original by: Kevin van Zonneveld (http://kvz.io)
  // improved by: Waldo Malqui Silva (http://waldo.malqui.info)
  //   example 1: array_fill(5, 6, 'banana')
  //   returns 1: { 5: 'banana', 6: 'banana', 7: 'banana', 8: 'banana', 9: 'banana', 10: 'banana' }
  var key
  var tmpArr = {}
  if (!isNaN(startIndex) && !isNaN(num)) {
    for (key = 0; key < num; key++) {
      tmpArr[(key + startIndex)] = mixedVal
    }
  }
  return tmpArr
}
/**
 * array_fill_keys for phpjs
 */
function array_fill_keys (keys, value) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_fill_keys/
  // original by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  //   example 1: var $keys = {'a': 'foo', 2: 5, 3: 10, 4: 'bar'}
  //   example 1: array_fill_keys($keys, 'banana')
  //   returns 1: {"foo": "banana", 5: "banana", 10: "banana", "bar": "banana"}
  var retObj = {}
  var key = ''
  for (key in keys) {
    retObj[keys[key]] = value
  }
  return retObj
}
/**
 * array_filter for phpjs
 */
function array_filter (arr, func) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_filter/
  // original by: Brett Zamir (http://brett-zamir.me)
  //    input by: max4ever
  // improved by: Brett Zamir (http://brett-zamir.me)
  //      note 1: Takes a function as an argument, not a function's name
  //   example 1: var odd = function (num) {return (num & 1);}
  //   example 1: array_filter({"a": 1, "b": 2, "c": 3, "d": 4, "e": 5}, odd)
  //   returns 1: {"a": 1, "c": 3, "e": 5}
  //   example 2: var even = function (num) {return (!(num & 1));}
  //   example 2: array_filter([6, 7, 8, 9, 10, 11, 12], even)
  //   returns 2: [ 6, , 8, , 10, , 12 ]
  //   example 3: array_filter({"a": 1, "b": false, "c": -1, "d": 0, "e": null, "f":'', "g":undefined})
  //   returns 3: {"a":1, "c":-1}
  var retObj = {}
  var k
  func = func || function (v) {
    return v
  }
  // @todo: Issue #73
  if (Object.prototype.toString.call(arr) === '[object Array]') {
    retObj = []
  }
  for (k in arr) {
    if (func(arr[k])) {
      retObj[k] = arr[k]
    }
  }
  return retObj
}
/**
 * array_flip for phpjs
 */
function array_flip (trans) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_flip/
  // original by: Kevin van Zonneveld (http://kvz.io)
  // improved by: Pier Paolo Ramon (http://www.mastersoup.com/)
  // improved by: Brett Zamir (http://brett-zamir.me)
  //   example 1: array_flip( {a: 1, b: 1, c: 2} )
  //   returns 1: {1: 'b', 2: 'c'}
  var key
  var tmpArr = {}
  for (key in trans) {
    if (!trans.hasOwnProperty(key)) {
      continue
    }
    tmpArr[trans[key]] = key
  }
  return tmpArr
}
/**
 * array_intersect_assoc for phpjs
 */
function array_intersect_assoc (arr1) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_intersect_assoc/
  // original by: Brett Zamir (http://brett-zamir.me)
  //      note 1: These only output associative arrays (would need to be
  //      note 1: all numeric and counting from zero to be numeric)
  //   example 1: var $array1 = {a: 'green', b: 'brown', c: 'blue', 0: 'red'}
  //   example 1: var $array2 = {a: 'green', 0: 'yellow', 1: 'red'}
  //   example 1: array_intersect_assoc($array1, $array2)
  //   returns 1: {a: 'green'}
  var retArr = {}
  var argl = arguments.length
  var arglm1 = argl - 1
  var k1 = ''
  var arr = {}
  var i = 0
  var k = ''
  arr1keys: for (k1 in arr1) { // eslint-disable-line no-labels
    arrs: for (i = 1; i < argl; i++) { // eslint-disable-line no-labels
      arr = arguments[i]
      for (k in arr) {
        if (arr[k] === arr1[k1] && k === k1) {
          if (i === arglm1) {
            retArr[k1] = arr1[k1]
          }
          // If the innermost loop always leads at least once to an equal value,
          // continue the loop until done
          continue arrs // eslint-disable-line no-labels
        }
      }
      // If it reaches here, it wasn't found in at least one array, so try next value
      continue arr1keys // eslint-disable-line no-labels
    }
  }
  return retArr
}
/**
 * array_intersect for phpjs
 */
function array_intersect (arr1) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_intersect/
  // original by: Brett Zamir (http://brett-zamir.me)
  //      note 1: These only output associative arrays (would need to be
  //      note 1: all numeric and counting from zero to be numeric)
  //   example 1: var $array1 = {'a' : 'green', 0:'red', 1: 'blue'}
  //   example 1: var $array2 = {'b' : 'green', 0:'yellow', 1:'red'}
  //   example 1: var $array3 = ['green', 'red']
  //   example 1: var $result = array_intersect($array1, $array2, $array3)
  //   returns 1: {0: 'red', a: 'green'}
  var retArr = {}
  var argl = arguments.length
  var arglm1 = argl - 1
  var k1 = ''
  var arr = {}
  var i = 0
  var k = ''
  arr1keys: for (k1 in arr1) { // eslint-disable-line no-labels
    arrs: for (i = 1; i < argl; i++) { // eslint-disable-line no-labels
      arr = arguments[i]
      for (k in arr) {
        if (arr[k] === arr1[k1]) {
          if (i === arglm1) {
            retArr[k1] = arr1[k1]
          }
          // If the innermost loop always leads at least once to an equal value,
          // continue the loop until done
          continue arrs// eslint-disable-line no-labels
        }
      }
      // If it reaches here, it wasn't found in at least one array, so try next value
      continue arr1keys// eslint-disable-line no-labels
    }
  }
  return retArr
}
/**
 * array_intersect_key for phpjs
 */
function array_intersect_key (arr1) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_intersect_key/
  // original by: Brett Zamir (http://brett-zamir.me)
  //      note 1: These only output associative arrays (would need to be
  //      note 1: all numeric and counting from zero to be numeric)
  //   example 1: var $array1 = {a: 'green', b: 'brown', c: 'blue', 0: 'red'}
  //   example 1: var $array2 = {a: 'green', 0: 'yellow', 1: 'red'}
  //   example 1: array_intersect_key($array1, $array2)
  //   returns 1: {0: 'red', a: 'green'}
  var retArr = {}
  var argl = arguments.length
  var arglm1 = argl - 1
  var k1 = ''
  var arr = {}
  var i = 0
  var k = ''
  arr1keys: for (k1 in arr1) { // eslint-disable-line no-labels
    if (!arr1.hasOwnProperty(k1)) {
      continue
    }
    arrs: for (i = 1; i < argl; i++) { // eslint-disable-line no-labels
      arr = arguments[i]
      for (k in arr) {
        if (!arr.hasOwnProperty(k)) {
          continue
        }
        if (k === k1) {
          if (i === arglm1) {
            retArr[k1] = arr1[k1]
          }
          // If the innermost loop always leads at least once to an equal value,
          // continue the loop until done
          continue arrs // eslint-disable-line no-labels
        }
      }
      // If it reaches here, it wasn't found in at least one array, so try next value
      continue arr1keys // eslint-disable-line no-labels
    }
  }
  return retArr
}
/**
 * array_intersect_uassoc for phpjs
 */
function array_intersect_uassoc (arr1) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_intersect_uassoc/
  // original by: Brett Zamir (http://brett-zamir.me)
  //   example 1: var $array1 = {a: 'green', b: 'brown', c: 'blue', 0: 'red'}
  //   example 1: var $array2 = {a: 'GREEN', B: 'brown', 0: 'yellow', 1: 'red'}
  //   example 1: array_intersect_uassoc($array1, $array2, function (f_string1, f_string2){var string1 = (f_string1+'').toLowerCase(); var string2 = (f_string2+'').toLowerCase(); if (string1 > string2) return 1; if (string1 === string2) return 0; return -1;})
  //   returns 1: {b: 'brown'}
  var retArr = {}
  var arglm1 = arguments.length - 1
  var arglm2 = arglm1 - 1
  var cb = arguments[arglm1]
  // var cb0 = arguments[arglm2]
  var k1 = ''
  var i = 1
  var k = ''
  var arr = {}
  var $global = (typeof window !== 'undefined' ? window : global)
  cb = (typeof cb === 'string')
    ? $global[cb]
    : (Object.prototype.toString.call(cb) === '[object Array]')
      ? $global[cb[0]][cb[1]]
      : cb
  // cb0 = (typeof cb0 === 'string')
  //   ? $global[cb0]
  //   : (Object.prototype.toString.call(cb0) === '[object Array]')
  //     ? $global[cb0[0]][cb0[1]]
  //     : cb0
  arr1keys: for (k1 in arr1) { // eslint-disable-line no-labels
    arrs: for (i = 1; i < arglm1; i++) { // eslint-disable-line no-labels
      arr = arguments[i]
      for (k in arr) {
        if (arr[k] === arr1[k1] && cb(k, k1) === 0) {
          if (i === arglm2) {
            retArr[k1] = arr1[k1]
          }
          // If the innermost loop always leads at least once to an equal value,
          // continue the loop until done
          continue arrs // eslint-disable-line no-labels
        }
      }
      // If it reaches here, it wasn't found in at least one array, so try next value
      continue arr1keys // eslint-disable-line no-labels
    }
  }
  return retArr
}
/**
 * array_intersect_ukey for phpjs
 */
function array_intersect_ukey (arr1) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_intersect_ukey/
  // original by: Brett Zamir (http://brett-zamir.me)
  //   example 1: var $array1 = {blue: 1, red: 2, green: 3, purple: 4}
  //   example 1: var $array2 = {green: 5, blue: 6, yellow: 7, cyan: 8}
  //   example 1: array_intersect_ukey ($array1, $array2, function (key1, key2){ return (key1 === key2 ? 0 : (key1 > key2 ? 1 : -1)); })
  //   returns 1: {blue: 1, green: 3}
  var retArr = {}
  var arglm1 = arguments.length - 1
  var arglm2 = arglm1 - 1
  var cb = arguments[arglm1]
  // var cb0 = arguments[arglm2]
  var k1 = ''
  var i = 1
  var k = ''
  var arr = {}
  var $global = (typeof window !== 'undefined' ? window : global)
  cb = (typeof cb === 'string')
    ? $global[cb]
    : (Object.prototype.toString.call(cb) === '[object Array]')
      ? $global[cb[0]][cb[1]]
      : cb
  // cb0 = (typeof cb0 === 'string')
  //   ? $global[cb0]
  //   : (Object.prototype.toString.call(cb0) === '[object Array]')
  //     ? $global[cb0[0]][cb0[1]]
  //     : cb0
  arr1keys: for (k1 in arr1) { // eslint-disable-line no-labels
    arrs: for (i = 1; i < arglm1; i++) { // eslint-disable-line no-labels
      arr = arguments[i]
      for (k in arr) {
        if (cb(k, k1) === 0) {
          if (i === arglm2) {
            retArr[k1] = arr1[k1]
          }
          // If the innermost loop always leads at least once to an equal value,
          // continue the loop until done
          continue arrs // eslint-disable-line no-labels
        }
      }
      // If it reaches here, it wasn't found in at least one array, so try next value
      continue arr1keys // eslint-disable-line no-labels
    }
  }
  return retArr
}
/**
 * array_key_exists for phpjs
 */
function array_key_exists (key, search) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_key_exists/
  // original by: Kevin van Zonneveld (http://kvz.io)
  // improved by: Felix Geisendoerfer (http://www.debuggable.com/felix)
  //   example 1: array_key_exists('kevin', {'kevin': 'van Zonneveld'})
  //   returns 1: true
  if (!search || (search.constructor !== Array && search.constructor !== Object)) {
    return false
  }
  return key in search
}
/**
 * array_keys for phpjs
 */
function array_keys (input, searchValue, argStrict) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_keys/
  // original by: Kevin van Zonneveld (http://kvz.io)
  //    input by: Brett Zamir (http://brett-zamir.me)
  //    input by: P
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  // improved by: jd
  // improved by: Brett Zamir (http://brett-zamir.me)
  //   example 1: array_keys( {firstname: 'Kevin', surname: 'van Zonneveld'} )
  //   returns 1: [ 'firstname', 'surname' ]
  var search = typeof searchValue !== 'undefined'
  var tmpArr = []
  var strict = !!argStrict
  var include = true
  var key = ''
  for (key in input) {
    if (input.hasOwnProperty(key)) {
      include = true
      if (search) {
        if (strict && input[key] !== searchValue) {
          include = false
        } else if (input[key] !== searchValue) {
          include = false
        }
      }
      if (include) {
        tmpArr[tmpArr.length] = key
      }
    }
  }
  return tmpArr
}
/**
 * array_map for phpjs
 */
function array_map (callback) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_map/
  // original by: Andrea Giammarchi (http://webreflection.blogspot.com)
  // improved by: Kevin van Zonneveld (http://kvz.io)
  // improved by: Brett Zamir (http://brett-zamir.me)
  //    input by: thekid
  //      note 1: If the callback is a string (or object, if an array is supplied),
  //      note 1: it can only work if the function name is in the global context
  //   example 1: array_map( function (a){return (a * a * a)}, [1, 2, 3, 4, 5] )
  //   returns 1: [ 1, 8, 27, 64, 125 ]
  var argc = arguments.length
  var argv = arguments
  var obj = null
  var cb = callback
  var j = argv[1].length
  var i = 0
  var k = 1
  var m = 0
  var tmp = []
  var tmpArr = []
  var $global = (typeof window !== 'undefined' ? window : global)
  while (i < j) {
    while (k < argc) {
      tmp[m++] = argv[k++][i]
    }
    m = 0
    k = 1
    if (callback) {
      if (typeof callback === 'string') {
        cb = $global[callback]
      } else if (typeof callback === 'object' && callback.length) {
        obj = typeof callback[0] === 'string' ? $global[callback[0]] : callback[0]
        if (typeof obj === 'undefined') {
          throw new Error('Object not found: ' + callback[0])
        }
        cb = typeof callback[1] === 'string' ? obj[callback[1]] : callback[1]
      }
      tmpArr[i++] = cb.apply(obj, tmp)
    } else {
      tmpArr[i++] = tmp
    }
    tmp = []
  }
  return tmpArr
}
/**
 * array_merge for phpjs
 */
function array_merge () { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_merge/
  // original by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: Nate
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  //    input by: josh
  //   example 1: var $arr1 = {"color": "red", 0: 2, 1: 4}
  //   example 1: var $arr2 = {0: "a", 1: "b", "color": "green", "shape": "trapezoid", 2: 4}
  //   example 1: array_merge($arr1, $arr2)
  //   returns 1: {"color": "green", 0: 2, 1: 4, 2: "a", 3: "b", "shape": "trapezoid", 4: 4}
  //   example 2: var $arr1 = []
  //   example 2: var $arr2 = {1: "data"}
  //   example 2: array_merge($arr1, $arr2)
  //   returns 2: {0: "data"}
  var args = Array.prototype.slice.call(arguments)
  var argl = args.length
  var arg
  var retObj = {}
  var k = ''
  var argil = 0
  var j = 0
  var i = 0
  var ct = 0
  var toStr = Object.prototype.toString
  var retArr = true
  for (i = 0; i < argl; i++) {
    if (toStr.call(args[i]) !== '[object Array]') {
      retArr = false
      break
    }
  }
  if (retArr) {
    retArr = []
    for (i = 0; i < argl; i++) {
      retArr = retArr.concat(args[i])
    }
    return retArr
  }
  for (i = 0, ct = 0; i < argl; i++) {
    arg = args[i]
    if (toStr.call(arg) === '[object Array]') {
      for (j = 0, argil = arg.length; j < argil; j++) {
        retObj[ct++] = arg[j]
      }
    } else {
      for (k in arg) {
        if (arg.hasOwnProperty(k)) {
          if (parseInt(k, 10) + '' === k) {
            retObj[ct++] = arg[k]
          } else {
            retObj[k] = arg[k]
          }
        }
      }
    }
  }
  return retObj
}
/**
 * array_multisort for phpjs
 */
function array_multisort (arr) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_multisort/
  // original by: Theriault (https://github.com/Theriault)
  //   example 1: array_multisort([1, 2, 1, 2, 1, 2], [1, 2, 3, 4, 5, 6])
  //   returns 1: true
  //   example 2: var $characters = {A: 'Edward', B: 'Locke', C: 'Sabin', D: 'Terra', E: 'Edward'}
  //   example 2: var $jobs = {A: 'Warrior', B: 'Thief', C: 'Monk', D: 'Mage', E: 'Knight'}
  //   example 2: array_multisort($characters, 'SORT_DESC', 'SORT_STRING', $jobs, 'SORT_ASC', 'SORT_STRING')
  //   returns 2: true
  //   example 3: var $lastnames = [ 'Carter','Adams','Monroe','Tyler','Madison','Kennedy','Adams']
  //   example 3: var $firstnames = ['James', 'John' ,'James', 'John', 'James',  'John',   'John']
  //   example 3: var $president = [ 39, 6, 5, 10, 4, 35, 2 ]
  //   example 3: array_multisort($firstnames, 'SORT_DESC', 'SORT_STRING', $lastnames, 'SORT_ASC', 'SORT_STRING', $president, 'SORT_NUMERIC')
  //   returns 3: true
  //      note 1: flags: Translation table for sort arguments.
  //      note 1: Each argument turns on certain bits in the flag byte through addition.
  //      note 1: bits: HGFE DCBA
  //      note 1: args: Holds pointer to arguments for reassignment
  var g
  var i
  var j
  var k
  var l
  var sal
  var vkey
  var elIndex
  var lastSorts
  var tmpArray
  var zlast
  var sortFlag = [0]
  var thingsToSort = []
  var nLastSort = []
  var lastSort = []
  // possibly redundant
  var args = arguments
  var flags = {
    'SORT_REGULAR': 16,
    'SORT_NUMERIC': 17,
    'SORT_STRING': 18,
    'SORT_ASC': 32,
    'SORT_DESC': 40
  }
  var sortDuplicator = function (a, b) {
    return nLastSort.shift()
  }
  var sortFunctions = [
    [
      function (a, b) {
        lastSort.push(a > b ? 1 : (a < b ? -1 : 0))
        return a > b ? 1 : (a < b ? -1 : 0)
      },
      function (a, b) {
        lastSort.push(b > a ? 1 : (b < a ? -1 : 0))
        return b > a ? 1 : (b < a ? -1 : 0)
      }
    ],
    [
      function (a, b) {
        lastSort.push(a - b)
        return a - b
      },
      function (a, b) {
        lastSort.push(b - a)
        return b - a
      }
    ],
    [
      function (a, b) {
        lastSort.push((a + '') > (b + '') ? 1 : ((a + '') < (b + '') ? -1 : 0))
        return (a + '') > (b + '') ? 1 : ((a + '') < (b + '') ? -1 : 0)
      },
      function (a, b) {
        lastSort.push((b + '') > (a + '') ? 1 : ((b + '') < (a + '') ? -1 : 0))
        return (b + '') > (a + '') ? 1 : ((b + '') < (a + '') ? -1 : 0)
      }
    ]
  ]
  var sortArrs = [
    []
  ]
  var sortKeys = [
    []
  ]
  // Store first argument into sortArrs and sortKeys if an Object.
  // First Argument should be either a Javascript Array or an Object,
  // otherwise function would return FALSE like in PHP
  if (Object.prototype.toString.call(arr) === '[object Array]') {
    sortArrs[0] = arr
  } else if (arr && typeof arr === 'object') {
    for (i in arr) {
      if (arr.hasOwnProperty(i)) {
        sortKeys[0].push(i)
        sortArrs[0].push(arr[i])
      }
    }
  } else {
    return false
  }
  // arrMainLength: Holds the length of the first array.
  // All other arrays must be of equal length, otherwise function would return FALSE like in PHP
  // sortComponents: Holds 2 indexes per every section of the array
  // that can be sorted. As this is the start, the whole array can be sorted.
  var arrMainLength = sortArrs[0].length
  var sortComponents = [0, arrMainLength]
  // Loop through all other arguments, checking lengths and sort flags
  // of arrays and adding them to the above variables.
  var argl = arguments.length
  for (j = 1; j < argl; j++) {
    if (Object.prototype.toString.call(arguments[j]) === '[object Array]') {
      sortArrs[j] = arguments[j]
      sortFlag[j] = 0
      if (arguments[j].length !== arrMainLength) {
        return false
      }
    } else if (arguments[j] && typeof arguments[j] === 'object') {
      sortKeys[j] = []
      sortArrs[j] = []
      sortFlag[j] = 0
      for (i in arguments[j]) {
        if (arguments[j].hasOwnProperty(i)) {
          sortKeys[j].push(i)
          sortArrs[j].push(arguments[j][i])
        }
      }
      if (sortArrs[j].length !== arrMainLength) {
        return false
      }
    } else if (typeof arguments[j] === 'string') {
      var lFlag = sortFlag.pop()
      // Keep extra parentheses around latter flags check
      // to avoid minimization leading to CDATA closer
      if (typeof flags[arguments[j]] === 'undefined' ||
        ((((flags[arguments[j]]) >>> 4) & (lFlag >>> 4)) > 0)) {
        return false
      }
      sortFlag.push(lFlag + flags[arguments[j]])
    } else {
      return false
    }
  }
  for (i = 0; i !== arrMainLength; i++) {
    thingsToSort.push(true)
  }
  // Sort all the arrays....
  for (i in sortArrs) {
    if (sortArrs.hasOwnProperty(i)) {
      lastSorts = []
      tmpArray = []
      elIndex = 0
      nLastSort = []
      lastSort = []
      // If there are no sortComponents, then no more sorting is neeeded.
      // Copy the array back to the argument.
      if (sortComponents.length === 0) {
        if (Object.prototype.toString.call(arguments[i]) === '[object Array]') {
          args[i] = sortArrs[i]
        } else {
          for (k in arguments[i]) {
            if (arguments[i].hasOwnProperty(k)) {
              delete arguments[i][k]
            }
          }
          sal = sortArrs[i].length
          for (j = 0, vkey = 0; j < sal; j++) {
            vkey = sortKeys[i][j]
            args[i][vkey] = sortArrs[i][j]
          }
        }
        delete sortArrs[i]
        delete sortKeys[i]
        continue
      }
      // Sort function for sorting. Either sorts asc or desc, regular/string or numeric.
      var sFunction = sortFunctions[(sortFlag[i] & 3)][((sortFlag[i] & 8) > 0) ? 1 : 0]
      // Sort current array.
      for (l = 0; l !== sortComponents.length; l += 2) {
        tmpArray = sortArrs[i].slice(sortComponents[l], sortComponents[l + 1] + 1)
        tmpArray.sort(sFunction)
        // Is there a better way to copy an array in Javascript?
        lastSorts[l] = [].concat(lastSort)
        elIndex = sortComponents[l]
        for (g in tmpArray) {
          if (tmpArray.hasOwnProperty(g)) {
            sortArrs[i][elIndex] = tmpArray[g]
            elIndex++
          }
        }
      }
      // Duplicate the sorting of the current array on future arrays.
      sFunction = sortDuplicator
      for (j in sortArrs) {
        if (sortArrs.hasOwnProperty(j)) {
          if (sortArrs[j] === sortArrs[i]) {
            continue
          }
          for (l = 0; l !== sortComponents.length; l += 2) {
            tmpArray = sortArrs[j].slice(sortComponents[l], sortComponents[l + 1] + 1)
            // alert(l + ':' + nLastSort);
            nLastSort = [].concat(lastSorts[l])
            tmpArray.sort(sFunction)
            elIndex = sortComponents[l]
            for (g in tmpArray) {
              if (tmpArray.hasOwnProperty(g)) {
                sortArrs[j][elIndex] = tmpArray[g]
                elIndex++
              }
            }
          }
        }
      }
      // Duplicate the sorting of the current array on array keys
      for (j in sortKeys) {
        if (sortKeys.hasOwnProperty(j)) {
          for (l = 0; l !== sortComponents.length; l += 2) {
            tmpArray = sortKeys[j].slice(sortComponents[l], sortComponents[l + 1] + 1)
            nLastSort = [].concat(lastSorts[l])
            tmpArray.sort(sFunction)
            elIndex = sortComponents[l]
            for (g in tmpArray) {
              if (tmpArray.hasOwnProperty(g)) {
                sortKeys[j][elIndex] = tmpArray[g]
                elIndex++
              }
            }
          }
        }
      }
      // Generate the next sortComponents
      zlast = null
      sortComponents = []
      for (j in sortArrs[i]) {
        if (sortArrs[i].hasOwnProperty(j)) {
          if (!thingsToSort[j]) {
            if ((sortComponents.length & 1)) {
              sortComponents.push(j - 1)
            }
            zlast = null
            continue
          }
          if (!(sortComponents.length & 1)) {
            if (zlast !== null) {
              if (sortArrs[i][j] === zlast) {
                sortComponents.push(j - 1)
              } else {
                thingsToSort[j] = false
              }
            }
            zlast = sortArrs[i][j]
          } else {
            if (sortArrs[i][j] !== zlast) {
              sortComponents.push(j - 1)
              zlast = sortArrs[i][j]
            }
          }
        }
      }
      if (sortComponents.length & 1) {
        sortComponents.push(j)
      }
      if (Object.prototype.toString.call(arguments[i]) === '[object Array]') {
        args[i] = sortArrs[i]
      } else {
        for (j in arguments[i]) {
          if (arguments[i].hasOwnProperty(j)) {
            delete arguments[i][j]
          }
        }
        sal = sortArrs[i].length
        for (j = 0, vkey = 0; j < sal; j++) {
          vkey = sortKeys[i][j]
          args[i][vkey] = sortArrs[i][j]
        }
      }
      delete sortArrs[i]
      delete sortKeys[i]
    }
  }
  return true
}
/**
 * array_pad for phpjs
 */
function array_pad (input, padSize, padValue) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_pad/
  // original by: Waldo Malqui Silva (http://waldo.malqui.info)
  //   example 1: array_pad([ 7, 8, 9 ], 2, 'a')
  //   returns 1: [ 7, 8, 9]
  //   example 2: array_pad([ 7, 8, 9 ], 5, 'a')
  //   returns 2: [ 7, 8, 9, 'a', 'a']
  //   example 3: array_pad([ 7, 8, 9 ], 5, 2)
  //   returns 3: [ 7, 8, 9, 2, 2]
  //   example 4: array_pad([ 7, 8, 9 ], -5, 'a')
  //   returns 4: [ 'a', 'a', 7, 8, 9 ]
  var pad = []
  var newArray = []
  var newLength
  var diff = 0
  var i = 0
  if (Object.prototype.toString.call(input) === '[object Array]' && !isNaN(padSize)) {
    newLength = ((padSize < 0) ? (padSize * -1) : padSize)
    diff = newLength - input.length
    if (diff > 0) {
      for (i = 0; i < diff; i++) {
        newArray[i] = padValue
      }
      pad = ((padSize < 0) ? newArray.concat(input) : input.concat(newArray))
    } else {
      pad = input
    }
  }
  return pad
}
/**
 * array_pop for phpjs
 */
function array_pop (inputArr) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_pop/
  // original by: Kevin van Zonneveld (http://kvz.io)
  // improved by: Kevin van Zonneveld (http://kvz.io)
  //    input by: Brett Zamir (http://brett-zamir.me)
  //    input by: Theriault (https://github.com/Theriault)
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  //      note 1: While IE (and other browsers) support iterating an object's
  //      note 1: own properties in order, if one attempts to add back properties
  //      note 1: in IE, they may end up in their former position due to their position
  //      note 1: being retained. So use of this function with "associative arrays"
  //      note 1: (objects) may lead to unexpected behavior in an IE environment if
  //      note 1: you add back properties with the same keys that you removed
  //   example 1: array_pop([0,1,2])
  //   returns 1: 2
  //   example 2: var $data = {firstName: 'Kevin', surName: 'van Zonneveld'}
  //   example 2: var $lastElem = array_pop($data)
  //   example 2: var $result = $data
  //   returns 2: {firstName: 'Kevin'}
  var key = ''
  var lastKey = ''
  if (inputArr.hasOwnProperty('length')) {
    // Indexed
    if (!inputArr.length) {
      // Done popping, are we?
      return null
    }
    return inputArr.pop()
  } else {
    // Associative
    for (key in inputArr) {
      if (inputArr.hasOwnProperty(key)) {
        lastKey = key
      }
    }
    if (lastKey) {
      var tmp = inputArr[lastKey]
      delete (inputArr[lastKey])
      return tmp
    } else {
      return null
    }
  }
}
/**
 * array_product for phpjs
 */
function array_product (input) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_product/
  // original by: Waldo Malqui Silva (http://waldo.malqui.info)
  //   example 1: array_product([ 2, 4, 6, 8 ])
  //   returns 1: 384
  var idx = 0
  var product = 1
  var il = 0
  if (Object.prototype.toString.call(input) !== '[object Array]') {
    return null
  }
  il = input.length
  while (idx < il) {
    product *= (!isNaN(input[idx]) ? input[idx] : 0)
    idx++
  }
  return product
}
/**
 * array_push for phpjs
 */
function array_push (inputArr) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_push/
  // original by: Kevin van Zonneveld (http://kvz.io)
  // improved by: Brett Zamir (http://brett-zamir.me)
  //      note 1: Note also that IE retains information about property position even
  //      note 1: after being supposedly deleted, so if you delete properties and then
  //      note 1: add back properties with the same keys (including numeric) that had
  //      note 1: been deleted, the order will be as before; thus, this function is not
  //      note 1: really recommended with associative arrays (objects) in IE environments
  //   example 1: array_push(['kevin','van'], 'zonneveld')
  //   returns 1: 3
  var i = 0
  var pr = ''
  var argv = arguments
  var argc = argv.length
  var allDigits = /^\d$/
  var size = 0
  var highestIdx = 0
  var len = 0
  if (inputArr.hasOwnProperty('length')) {
    for (i = 1; i < argc; i++) {
      inputArr[inputArr.length] = argv[i]
    }
    return inputArr.length
  }
  // Associative (object)
  for (pr in inputArr) {
    if (inputArr.hasOwnProperty(pr)) {
      ++len
      if (pr.search(allDigits) !== -1) {
        size = parseInt(pr, 10)
        highestIdx = size > highestIdx ? size : highestIdx
      }
    }
  }
  for (i = 1; i < argc; i++) {
    inputArr[++highestIdx] = argv[i]
  }
  return len + i - 1
}

/**
 * array_rand for phpjs
 */
function array_rand (array, num) { // eslint-disable-line camelcase
  //       discuss at: http://locutus.io/php/array_rand/
  //      original by: Waldo Malqui Silva (http://waldo.malqui.info)
  // reimplemented by: Rafał Kukawski
  //        example 1: array_rand( ['Kevin'], 1 )
  //        returns 1: '0'
  // By using Object.keys we support both, arrays and objects
  // which phpjs wants to support
  var keys = Object.keys(array)
  if (typeof num === 'undefined' || num === null) {
    num = 1
  } else {
    num = +num
  }
  if (isNaN(num) || num < 1 || num > keys.length) {
    return null
  }
  // shuffle the array of keys
  for (var i = keys.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1)) // 0 ≤ j ≤ i
    var tmp = keys[j]
    keys[j] = keys[i]
    keys[i] = tmp
  }
  return num === 1 ? keys[0] : keys.slice(0, num)
}

/**
 * array_reduce for phpjs
 */
function array_reduce (aInput, callback) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_reduce/
  // original by: Alfonso Jimenez (http://www.alfonsojimenez.com)
  //      note 1: Takes a function as an argument, not a function's name
  //   example 1: array_reduce([1, 2, 3, 4, 5], function (v, w){v += w;return v;})
  //   returns 1: 15
  var lon = aInput.length
  var res = 0
  var i = 0
  var tmp = []
  for (i = 0; i < lon; i += 2) {
    tmp[0] = aInput[i]
    if (aInput[(i + 1)]) {
      tmp[1] = aInput[(i + 1)]
    } else {
      tmp[1] = 0
    }
    res += callback.apply(null, tmp)
    tmp = []
  }
  return res
}

/**
 * array_replace for phpjs
 */
function array_replace (arr) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_replace/
  // original by: Brett Zamir (http://brett-zamir.me)
  //   example 1: array_replace(["orange", "banana", "apple", "raspberry"], {0 : "pineapple", 4 : "cherry"}, {0:"grape"})
  //   returns 1: {0: 'grape', 1: 'banana', 2: 'apple', 3: 'raspberry', 4: 'cherry'}
  var retObj = {}
  var i = 0
  var p = ''
  var argl = arguments.length
  if (argl < 2) {
    throw new Error('There should be at least 2 arguments passed to array_replace()')
  }
  // Although docs state that the arguments are passed in by reference,
  // it seems they are not altered, but rather the copy that is returned
  // (just guessing), so we make a copy here, instead of acting on arr itself
  for (p in arr) {
    retObj[p] = arr[p]
  }
  for (i = 1; i < argl; i++) {
    for (p in arguments[i]) {
      retObj[p] = arguments[i][p]
    }
  }
  return retObj
}
/**
 * array_replace_recursive for phpjs
 */
function array_replace_recursive (arr) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_replace_recursive/
  // original by: Brett Zamir (http://brett-zamir.me)
  //   example 1: array_replace_recursive({'citrus' : ['orange'], 'berries' : ['blackberry', 'raspberry']}, {'citrus' : ['pineapple'], 'berries' : ['blueberry']})
  //   returns 1: {citrus : ['pineapple'], berries : ['blueberry', 'raspberry']}
  var i = 0
  var p = ''
  var argl = arguments.length
  var retObj
  if (argl < 2) {
    throw new Error('There should be at least 2 arguments passed to array_replace_recursive()')
  }
  // Although docs state that the arguments are passed in by reference,
  // it seems they are not altered, but rather the copy that is returned
  // So we make a copy here, instead of acting on arr itself
  if (Object.prototype.toString.call(arr) === '[object Array]') {
    retObj = []
    for (p in arr) {
      retObj.push(arr[p])
    }
  } else {
    retObj = {}
    for (p in arr) {
      retObj[p] = arr[p]
    }
  }
  for (i = 1; i < argl; i++) {
    for (p in arguments[i]) {
      if (retObj[p] && typeof retObj[p] === 'object') {
        retObj[p] = array_replace_recursive(retObj[p], arguments[i][p])
      } else {
        retObj[p] = arguments[i][p]
      }
    }
  }
  return retObj
}


/**
 * array_reverse for phpjs
 */
function array_reverse (array, preserveKeys) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_reverse/
  // original by: Kevin van Zonneveld (http://kvz.io)
  // improved by: Karol Kowalski
  //   example 1: array_reverse( [ 'php', '4.0', ['green', 'red'] ], true)
  //   returns 1: { 2: ['green', 'red'], 1: '4.0', 0: 'php'}
  var isArray = Object.prototype.toString.call(array) === '[object Array]'
  var tmpArr = preserveKeys ? {} : []
  var key
  if (isArray && !preserveKeys) {
    return array.slice(0).reverse()
  }
  if (preserveKeys) {
    var keys = []
    for (key in array) {
      keys.push(key)
    }
    var i = keys.length
    while (i--) {
      key = keys[i]
      // @todo: don't rely on browsers keeping keys in insertion order
      // it's implementation specific
      // eg. the result will differ from expected in Google Chrome
      tmpArr[key] = array[key]
    }
  } else {
    for (key in array) {
      tmpArr.unshift(array[key])
    }
  }
  return tmpArr
}

/**
 * array_search for phpjs
 */
function array_search (needle, haystack, argStrict) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_search/
  // original by: Kevin van Zonneveld (http://kvz.io)
  //    input by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  // bugfixed by: Reynier de la Rosa (http://scriptinside.blogspot.com.es/)
  //        test: skip-all
  //   example 1: array_search('zonneveld', {firstname: 'kevin', middle: 'van', surname: 'zonneveld'})
  //   returns 1: 'surname'
  //   example 2: array_search('3', {a: 3, b: 5, c: 7})
  //   returns 2: 'a'
  var strict = !!argStrict
  var key = ''
  if (typeof needle === 'object' && needle.exec) {
    // Duck-type for RegExp
    if (!strict) {
      // Let's consider case sensitive searches as strict
      var flags = 'i' + (needle.global ? 'g' : '') +
        (needle.multiline ? 'm' : '') +
        // sticky is FF only
        (needle.sticky ? 'y' : '')
      needle = new RegExp(needle.source, flags)
    }
    for (key in haystack) {
      if (haystack.hasOwnProperty(key)) {
        if (needle.test(haystack[key])) {
          return key
        }
      }
    }
    return false
  }
  for (key in haystack) {
    if (haystack.hasOwnProperty(key)) {
      if ((strict && haystack[key] === needle) || (!strict && haystack[key] == needle)) { // eslint-disable-line eqeqeq
        return key
      }
    }
  }
  return false
}

/**
 * array_shift for phpjs
 */
function array_shift (inputArr) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_shift/
  // original by: Kevin van Zonneveld (http://kvz.io)
  // improved by: Martijn Wieringa
  //      note 1: Currently does not handle objects
  //   example 1: array_shift(['Kevin', 'van', 'Zonneveld'])
  //   returns 1: 'Kevin'
  var _checkToUpIndices = function (arr, ct, key) {
    // Deal with situation, e.g., if encounter index 4 and try
    // to set it to 0, but 0 exists later in loop (need to
    // increment all subsequent (skipping current key, since
    // we need its value below) until find unused)
    if (arr[ct] !== undefined) {
      var tmp = ct
      ct += 1
      if (ct === key) {
        ct += 1
      }
      ct = _checkToUpIndices(arr, ct, key)
      arr[ct] = arr[tmp]
      delete arr[tmp]
    }
    return ct
  }
  if (inputArr.length === 0) {
    return null
  }
  if (inputArr.length > 0) {
    return inputArr.shift()
  }
}
/**
 * array_sum for phpjs
 */
function array_sum (array) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_sum/
  // original by: Kevin van Zonneveld (http://kvz.io)
  // bugfixed by: Nate
  // bugfixed by: Gilbert
  // improved by: David Pilia (http://www.beteck.it/)
  // improved by: Brett Zamir (http://brett-zamir.me)
  //   example 1: array_sum([4, 9, 182.6])
  //   returns 1: 195.6
  //   example 2: var $total = []
  //   example 2: var $index = 0.1
  //   example 2: for (var $y = 0; $y < 12; $y++){ $total[$y] = $y + $index }
  //   example 2: array_sum($total)
  //   returns 2: 67.2
  var key
  var sum = 0
  // input sanitation
  if (typeof array !== 'object') {
    return null
  }
  for (key in array) {
    if (!isNaN(parseFloat(array[key]))) {
      sum += parseFloat(array[key])
    }
  }
  return sum
}

/**
 * array_udiff_assoc for phpjs
 */
function array_udiff_assoc (arr1) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_udiff_assoc/
  // original by: Brett Zamir (http://brett-zamir.me)
  //   example 1: array_udiff_assoc({0: 'kevin', 1: 'van', 2: 'Zonneveld'}, {0: 'Kevin', 4: 'van', 5: 'Zonneveld'}, function (f_string1, f_string2){var string1 = (f_string1+'').toLowerCase(); var string2 = (f_string2+'').toLowerCase(); if (string1 > string2) return 1; if (string1 === string2) return 0; return -1;})
  //   returns 1: {1: 'van', 2: 'Zonneveld'}
  var retArr = {}
  var arglm1 = arguments.length - 1
  var cb = arguments[arglm1]
  var arr = {}
  var i = 1
  var k1 = ''
  var k = ''
  var $global = (typeof window !== 'undefined' ? window : global)
  cb = (typeof cb === 'string')
    ? $global[cb]
    : (Object.prototype.toString.call(cb) === '[object Array]')
      ? $global[cb[0]][cb[1]]
      : cb
  arr1keys: for (k1 in arr1) { // eslint-disable-line no-labels
    for (i = 1; i < arglm1; i++) {
      arr = arguments[i]
      for (k in arr) {
        if (cb(arr[k], arr1[k1]) === 0 && k === k1) {
          // If it reaches here, it was found in at least one array, so try next value
          continue arr1keys // eslint-disable-line no-labels
        }
      }
      retArr[k1] = arr1[k1]
    }
  }
  return retArr
}

/**
 * array_udiff for phpjs
 */
function array_udiff (arr1) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_udiff/
  // original by: Brett Zamir (http://brett-zamir.me)
  //   example 1: var $array1 = {a: 'green', b: 'brown', c: 'blue', 0: 'red'}
  //   example 1: var $array2 = {a: 'GREEN', B: 'brown', 0: 'yellow', 1: 'red'}
  //   example 1: array_udiff($array1, $array2, function (f_string1, f_string2){var string1 = (f_string1+'').toLowerCase(); var string2 = (f_string2+'').toLowerCase(); if (string1 > string2) return 1; if (string1 === string2) return 0; return -1;})
  //   returns 1: {c: 'blue'}
  var retArr = {}
  var arglm1 = arguments.length - 1
  var cb = arguments[arglm1]
  var arr = ''
  var i = 1
  var k1 = ''
  var k = ''
  var $global = (typeof window !== 'undefined' ? window : global)
  cb = (typeof cb === 'string')
    ? $global[cb]
    : (Object.prototype.toString.call(cb) === '[object Array]')
      ? $global[cb[0]][cb[1]]
      : cb
  arr1keys: for (k1 in arr1) { // eslint-disable-line no-labels
    for (i = 1; i < arglm1; i++) { // eslint-disable-line no-labels
      arr = arguments[i]
      for (k in arr) {
        if (cb(arr[k], arr1[k1]) === 0) {
          // If it reaches here, it was found in at least one array, so try next value
          continue arr1keys // eslint-disable-line no-labels
        }
      }
      retArr[k1] = arr1[k1]
    }
  }
  return retArr
}

/**
 * array_udiff_uassoc for phpjs
 */
function array_udiff_uassoc (arr1) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_udiff_uassoc/
  // original by: Brett Zamir (http://brett-zamir.me)
  //   example 1: var $array1 = {a: 'green', b: 'brown', c: 'blue', 0: 'red'}
  //   example 1: var $array2 = {a: 'GREEN', B: 'brown', 0: 'yellow', 1: 'red'}
  //   example 1: array_udiff_uassoc($array1, $array2, function (f_string1, f_string2){var string1 = (f_string1+'').toLowerCase(); var string2 = (f_string2+'').toLowerCase(); if (string1 > string2) return 1; if (string1 === string2) return 0; return -1;}, function (f_string1, f_string2){var string1 = (f_string1+'').toLowerCase(); var string2 = (f_string2+'').toLowerCase(); if (string1 > string2) return 1; if (string1 === string2) return 0; return -1;})
  //   returns 1: {0: 'red', c: 'blue'}
  var retArr = {}
  var arglm1 = arguments.length - 1
  var arglm2 = arglm1 - 1
  var cb = arguments[arglm1]
  var cb0 = arguments[arglm2]
  var k1 = ''
  var i = 1
  var k = ''
  var arr = {}
  var $global = (typeof window !== 'undefined' ? window : global)
  cb = (typeof cb === 'string')
    ? $global[cb]
    : (Object.prototype.toString.call(cb) === '[object Array]')
      ? $global[cb[0]][cb[1]]
      : cb
  cb0 = (typeof cb0 === 'string')
    ? $global[cb0]
    : (Object.prototype.toString.call(cb0) === '[object Array]')
      ? $global[cb0[0]][cb0[1]]
      : cb0
  arr1keys: for (k1 in arr1) { // eslint-disable-line no-labels
    for (i = 1; i < arglm2; i++) {
      arr = arguments[i]
      for (k in arr) {
        if (cb0(arr[k], arr1[k1]) === 0 && cb(k, k1) === 0) {
          // If it reaches here, it was found in at least one array, so try next value
          continue arr1keys // eslint-disable-line no-labels
        }
      }
      retArr[k1] = arr1[k1]
    }
  }
  return retArr
}

/**
 * array_uintersect for phpjs
 */
function array_uintersect (arr1) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_uintersect/
  // original by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: Demosthenes Koptsis
  //   example 1: var $array1 = {a: 'green', b: 'brown', c: 'blue', 0: 'red'}
  //   example 1: var $array2 = {a: 'GREEN', B: 'brown', 0: 'yellow', 1: 'red'}
  //   example 1: array_uintersect($array1, $array2, function( f_string1, f_string2){var string1 = (f_string1+'').toLowerCase(); var string2 = (f_string2+'').toLowerCase(); if (string1 > string2) return 1; if (string1 === string2) return 0; return -1;})
  //   returns 1: {a: 'green', b: 'brown', 0: 'red'}
  var retArr = {}
  var arglm1 = arguments.length - 1
  var arglm2 = arglm1 - 1
  var cb = arguments[arglm1]
  var k1 = ''
  var i = 1
  var arr = {}
  var k = ''
  var $global = (typeof window !== 'undefined' ? window : global)
  cb = (typeof cb === 'string')
    ? $global[cb]
    : (Object.prototype.toString.call(cb) === '[object Array]')
      ? $global[cb[0]][cb[1]]
      : cb
  arr1keys: for (k1 in arr1) { // eslint-disable-line no-labels
    arrs: for (i = 1; i < arglm1; i++) { // eslint-disable-line no-labels
      arr = arguments[i]
      for (k in arr) {
        if (cb(arr[k], arr1[k1]) === 0) {
          if (i === arglm2) {
            retArr[k1] = arr1[k1]
          }
          // If the innermost loop always leads at least once to an equal value,
          // continue the loop until done
          continue arrs // eslint-disable-line no-labels
        }
      }
      // If it reaches here, it wasn't found in at least one array, so try next value
      continue arr1keys // eslint-disable-line no-labels
    }
  }
  return retArr
}

/**
 * array_uintersect_uassoc for phpjs
 */
function array_uintersect_uassoc (arr1) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_uintersect_uassoc/
  // original by: Brett Zamir (http://brett-zamir.me)
  //   example 1: var $array1 = {a: 'green', b: 'brown', c: 'blue', 0: 'red'}
  //   example 1: var $array2 = {a: 'GREEN', B: 'brown', 0: 'yellow', 1: 'red'}
  //   example 1: array_uintersect_uassoc($array1, $array2, function (f_string1, f_string2){var string1 = (f_string1+'').toLowerCase(); var string2 = (f_string2+'').toLowerCase(); if (string1 > string2) return 1; if (string1 === string2) return 0; return -1;}, function (f_string1, f_string2){var string1 = (f_string1+'').toLowerCase(); var string2 = (f_string2+'').toLowerCase(); if (string1 > string2) return 1; if (string1 === string2) return 0; return -1;})
  //   returns 1: {a: 'green', b: 'brown'}
  var retArr = {}
  var arglm1 = arguments.length - 1
  var arglm2 = arglm1 - 1
  var cb = arguments[arglm1]
  var cb0 = arguments[arglm2]
  var k1 = ''
  var i = 1
  var k = ''
  var arr = {}
  var $global = (typeof window !== 'undefined' ? window : global)
  cb = (typeof cb === 'string')
    ? $global[cb]
    : (Object.prototype.toString.call(cb) === '[object Array]')
      ? $global[cb[0]][cb[1]]
      : cb
  cb0 = (typeof cb0 === 'string')
    ? $global[cb0]
    : (Object.prototype.toString.call(cb0) === '[object Array]')
      ? $global[cb0[0]][cb0[1]]
      : cb0
  arr1keys: for (k1 in arr1) { // eslint-disable-line no-labels
    arrs: for (i = 1; i < arglm2; i++) { // eslint-disable-line no-labels
      arr = arguments[i]
      for (k in arr) {
        if (cb0(arr[k], arr1[k1]) === 0 && cb(k, k1) === 0) {
          if (i === arguments.length - 3) {
            retArr[k1] = arr1[k1]
          }
          // If the innermost loop always leads at least once to an equal value,
          // continue the loop until done
          continue arrs // eslint-disable-line no-labels
        }
      }
      // If it reaches here, it wasn't found in at least one array, so try next value
      continue arr1keys // eslint-disable-line no-labels
    }
  }
  return retArr
}

/**
 * array_unique for phpjs
 */
function array_unique (inputArr) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_unique/
  // original by: Carlos R. L. Rodrigues (http://www.jsfromhell.com)
  //    input by: duncan
  //    input by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  // bugfixed by: Nate
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  // improved by: Michael Grier
  //      note 1: The second argument, sort_flags is not implemented;
  //      note 1: also should be sorted (asort?) first according to docs
  //   example 1: array_unique(['Kevin','Kevin','van','Zonneveld','Kevin'])
  //   returns 1: {0: 'Kevin', 2: 'van', 3: 'Zonneveld'}
  //   example 2: array_unique({'a': 'green', 0: 'red', 'b': 'green', 1: 'blue', 2: 'red'})
  //   returns 2: {a: 'green', 0: 'red', 1: 'blue'}
  var key = ''
  var tmpArr2 = {}
  var val = ''
  var _arraySearch = function (needle, haystack) {
    var fkey = ''
    for (fkey in haystack) {
      if (haystack.hasOwnProperty(fkey)) {
        if ((haystack[fkey] + '') === (needle + '')) {
          return fkey
        }
      }
    }
    return false
  }
  for (key in inputArr) {
    if (inputArr.hasOwnProperty(key)) {
      val = inputArr[key]
      if (_arraySearch(val, tmpArr2) === false) {
        tmpArr2[key] = val
      }
    }
  }
  return tmpArr2
}
/**
 * array_unshift for phpjs
 */
function array_unshift (array) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_unshift/
  // original by: Kevin van Zonneveld (http://kvz.io)
  // improved by: Martijn Wieringa
  // improved by: jmweb
  //      note 1: Currently does not handle objects
  //   example 1: array_unshift(['van', 'Zonneveld'], 'Kevin')
  //   returns 1: 3
  var i = arguments.length
  while (--i !== 0) {
    arguments[0].unshift(arguments[i])
  }
  return arguments[0].length
}

/**
 * array_values for phpjs
 */
function array_values (input) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_values/
  // original by: Kevin van Zonneveld (http://kvz.io)
  // improved by: Brett Zamir (http://brett-zamir.me)
  //   example 1: array_values( {firstname: 'Kevin', surname: 'van Zonneveld'} )
  //   returns 1: [ 'Kevin', 'van Zonneveld' ]
  var tmpArr = []
  var key = ''
  for (key in input) {
    tmpArr[tmpArr.length] = input[key]
  }
  return tmpArr
}
/**
 * array_walk for phpjs
 */
function array_walk (array, funcname, userdata) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_walk/
  // original by: Johnny Mast (http://www.phpvrouwen.nl)
  // bugfixed by: David
  // improved by: Brett Zamir (http://brett-zamir.me)
  //      note 1: Only works with user-defined functions, not built-in functions like void()
  //   example 1: array_walk ([3, 4], function () {}, 'userdata')
  //   returns 1: true
  //   example 2: array_walk ('mystring', function () {})
  //   returns 2: false
  //   example 3: array_walk ({"title":"my title"}, function () {})
  //   returns 3: true
  if (!array || typeof array !== 'object') {
    return false
  }
  try {
    if (typeof funcname === 'function') {
      for (var key in array) {
        if (arguments.length > 2) {
          funcname(array[key], key, userdata)
        } else {
          funcname(array[key], key)
        }
      }
    } else {
      return false
    }
  } catch (e) {
    return false
  }
  return true
}
/**
 * array_walk_recursive for phpjs
 */
function array_walk_recursive (array, funcname, userdata) { // eslint-disable-line camelcase
  // original by: Hugues Peccatte
  //      note 1: Only works with user-defined functions, not built-in functions like void()
  //   example 1: array_walk_recursive([3, 4], function () {}, 'userdata')
  //   returns 1: true
  //   example 2: array_walk_recursive([3, [4]], function () {}, 'userdata')
  //   returns 2: true
  //   example 3: array_walk_recursive([3, []], function () {}, 'userdata')
  //   returns 3: true
  if (!array || typeof array !== 'object') {
    return false
  }
  if (typeof funcname !== 'function') {
    return false
  }
  for (var key in array) {
    // apply "funcname" recursively only on arrays
    if (Object.prototype.toString.call(array[key]) === '[object Array]') {
      var funcArgs = [array[key], funcname]
      if (arguments.length > 2) {
        funcArgs.push(userdata)
      }
      if (array_walk_recursive.apply(null, funcArgs) === false) {
        return false
      }
      continue
    }
    try {
      if (arguments.length > 2) {
        funcname(array[key], key, userdata)
      } else {
        funcname(array[key], key)
      }
    } catch (e) {
      return false
    }
  }
  return true
}
/**
 * count for phpjs
 */
function count (mixedVar, mode) {
  //  discuss at: http://locutus.io/php/count/
  // original by: Kevin van Zonneveld (http://kvz.io)
  //    input by: Waldo Malqui Silva (http://waldo.malqui.info)
  //    input by: merabi
  // bugfixed by: Soren Hansen
  // bugfixed by: Olivier Louvignes (http://mg-crea.com/)
  // improved by: Brett Zamir (http://brett-zamir.me)
  //   example 1: count([[0,0],[0,-4]], 'COUNT_RECURSIVE')
  //   returns 1: 6
  //   example 2: count({'one' : [1,2,3,4,5]}, 'COUNT_RECURSIVE')
  //   returns 2: 6
  var key
  var cnt = 0
  if (mixedVar === null || typeof mixedVar === 'undefined') {
    return 0
  } else if (mixedVar.constructor !== Array && mixedVar.constructor !== Object) {
    return 1
  }
  if (mode === 'COUNT_RECURSIVE') {
    mode = 1
  }
  if (mode !== 1) {
    mode = 0
  }
  for (key in mixedVar) {
    if (mixedVar.hasOwnProperty(key)) {
      cnt++
      if (mode === 1 && mixedVar[key] &&
        (mixedVar[key].constructor === Array ||
          mixedVar[key].constructor === Object)) {
        cnt += count(mixedVar[key], 1)
      }
    }
  }
  return cnt
}
/**
 * current for phpjs
 */
function current (arr) {
  //  discuss at: http://locutus.io/php/current/
  // original by: Brett Zamir (http://brett-zamir.me)
  //      note 1: Uses global: locutus to store the array pointer
  //   example 1: var $transport = ['foot', 'bike', 'car', 'plane']
  //   example 1: current($transport)
  //   returns 1: 'foot'
  var $global = (typeof window !== 'undefined' ? window : global)
  $global.$locutus = $global.$locutus || {}
  var $locutus = $global.$locutus
  $locutus.php = $locutus.php || {}
  $locutus.php.pointers = $locutus.php.pointers || []
  var pointers = $locutus.php.pointers
  var indexOf = function (value) {
    for (var i = 0, length = this.length; i < length; i++) {
      if (this[i] === value) {
        return i
      }
    }
    return -1
  }
  if (!pointers.indexOf) {
    pointers.indexOf = indexOf
  }
  if (pointers.indexOf(arr) === -1) {
    pointers.push(arr, 0)
  }
  var arrpos = pointers.indexOf(arr)
  var cursor = pointers[arrpos + 1]
  if (Object.prototype.toString.call(arr) === '[object Array]') {
    return arr[cursor] || false
  }
  var ct = 0
  for (var k in arr) {
    if (ct === cursor) {
      return arr[k]
    }
    ct++
  }
  // Empty
  return false
}
/**
 * each for phpjs
 */
function each (arr) {
  //  discuss at: http://locutus.io/php/each/
  // original by: Ates Goral (http://magnetiq.com)
  //  revised by: Brett Zamir (http://brett-zamir.me)
  //      note 1: Uses global: locutus to store the array pointer
  //   example 1: each({a: "apple", b: "balloon"})
  //   returns 1: {0: "a", 1: "apple", key: "a", value: "apple"}
  var $global = (typeof window !== 'undefined' ? window : global)
  $global.$locutus = $global.$locutus || {}
  var $locutus = $global.$locutus
  $locutus.php = $locutus.php || {}
  $locutus.php.pointers = $locutus.php.pointers || []
  var pointers = $locutus.php.pointers
  var indexOf = function (value) {
    for (var i = 0, length = this.length; i < length; i++) {
      if (this[i] === value) {
        return i
      }
    }
    return -1
  }
  if (!pointers.indexOf) {
    pointers.indexOf = indexOf
  }
  if (pointers.indexOf(arr) === -1) {
    pointers.push(arr, 0)
  }
  var arrpos = pointers.indexOf(arr)
  var cursor = pointers[arrpos + 1]
  var pos = 0
  if (Object.prototype.toString.call(arr) !== '[object Array]') {
    var ct = 0
    for (var k in arr) {
      if (ct === cursor) {
        pointers[arrpos + 1] += 1
        if (each.returnArrayOnly) {
          return [k, arr[k]]
        } else {
          return {
            1: arr[k],
            value: arr[k],
            0: k,
            key: k
          }
        }
      }
      ct++
    }
    // Empty
    return false
  }
  if (arr.length === 0 || cursor === arr.length) {
    return false
  }
  pos = cursor
  pointers[arrpos + 1] += 1
  if (each.returnArrayOnly) {
    return [pos, arr[pos]]
  } else {
    return {
      1: arr[pos],
      value: arr[pos],
      0: pos,
      key: pos
    }
  }
}

/**
 * end for phpjs
 */
function end (arr) {
  //  discuss at: http://locutus.io/php/end/
  // original by: Kevin van Zonneveld (http://kvz.io)
  // bugfixed by: Legaev Andrey
  //  revised by: J A R
  //  revised by: Brett Zamir (http://brett-zamir.me)
  // improved by: Kevin van Zonneveld (http://kvz.io)
  // improved by: Kevin van Zonneveld (http://kvz.io)
  //      note 1: Uses global: locutus to store the array pointer
  //   example 1: end({0: 'Kevin', 1: 'van', 2: 'Zonneveld'})
  //   returns 1: 'Zonneveld'
  //   example 2: end(['Kevin', 'van', 'Zonneveld'])
  //   returns 2: 'Zonneveld'
  var $global = (typeof window !== 'undefined' ? window : global)
  $global.$locutus = $global.$locutus || {}
  var $locutus = $global.$locutus
  $locutus.php = $locutus.php || {}
  $locutus.php.pointers = $locutus.php.pointers || []
  var pointers = $locutus.php.pointers
  var indexOf = function (value) {
    for (var i = 0, length = this.length; i < length; i++) {
      if (this[i] === value) {
        return i
      }
    }
    return -1
  }
  if (!pointers.indexOf) {
    pointers.indexOf = indexOf
  }
  if (pointers.indexOf(arr) === -1) {
    pointers.push(arr, 0)
  }
  var arrpos = pointers.indexOf(arr)
  if (Object.prototype.toString.call(arr) !== '[object Array]') {
    var ct = 0
    var val
    for (var k in arr) {
      ct++
      val = arr[k]
    }
    if (ct === 0) {
      // Empty
      return false
    }
    pointers[arrpos + 1] = ct - 1
    return val
  }
  if (arr.length === 0) {
    return false
  }
  pointers[arrpos + 1] = arr.length - 1
  return arr[pointers[arrpos + 1]]
}

// Split a string by a string.
//
// @param string separator
// @param string string
// @param int limit optional

function explode(separator, string, limit = PHP_INT_MAX) {
  // the limit
  // js:
  //   'a b c'.split(' ', 2)  => ['a', 'b']
  // php:
  //   explode(' ','a b c',2) => ['a','b c']

  let data = string.split(separator);
  if (limit < data.length) {
    const last = data.splice(limit - 1);
    data.push(last.join(' '));
  }
  return data;
}

// Checks if a value exists in an array.
//
// @param mixed needle
// @param array haystack
// @param bool strict = false
//
// If the third parameter strict is set to true then the in_array() function
// will also check the types of the needle in the haystack.
//
// @return bool

function in_array (needle, haystack, argStrict) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/in_array/
  // original by: Kevin van Zonneveld (http://kvz.io)
  // improved by: vlado houba
  // improved by: Jonas Sciangula Street (Joni2Back)
  //    input by: Billy
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  //   example 1: in_array('van', ['Kevin', 'van', 'Zonneveld'])
  //   returns 1: true
  //   example 2: in_array('vlado', {0: 'Kevin', vlado: 'van', 1: 'Zonneveld'})
  //   returns 2: false
  //   example 3: in_array(1, ['1', '2', '3'])
  //   example 3: in_array(1, ['1', '2', '3'], false)
  //   returns 3: true
  //   returns 3: true
  //   example 4: in_array(1, ['1', '2', '3'], true)
  //   returns 4: false
  var key = ''
  var strict = !!argStrict
  // we prevent the double check (strict && arr[key] === ndl) || (!strict && arr[key] === ndl)
  // in just one for, in order to improve the performance
  // deciding wich type of comparation will do before walk array
  if (strict) {
    for (key in haystack) {
      if (haystack[key] === needle) {
        return true
      }
    }
  } else {
    for (key in haystack) {
      if (haystack[key] == needle) { // eslint-disable-line eqeqeq
        return true
      }
    }
  }
  return false
}

// Fetch a key from an array.
// @param array|object _array
// @return int|string|null

function key (arr) {
  //  discuss at: http://locutus.io/php/key/
  // original by: Brett Zamir (http://brett-zamir.me)
  //    input by: Riddler (http://www.frontierwebdev.com/)
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  //      note 1: Uses global: locutus to store the array pointer
  //   example 1: var $array = {fruit1: 'apple', 'fruit2': 'orange'}
  //   example 1: key($array)
  //   returns 1: 'fruit1'
  var $global = (typeof window !== 'undefined' ? window : global)
  $global.$locutus = $global.$locutus || {}
  var $locutus = $global.$locutus
  $locutus.php = $locutus.php || {}
  $locutus.php.pointers = $locutus.php.pointers || []
  var pointers = $locutus.php.pointers
  var indexOf = function (value) {
    for (var i = 0, length = this.length; i < length; i++) {
      if (this[i] === value) {
        return i
      }
    }
    return -1
  }
  if (!pointers.indexOf) {
    pointers.indexOf = indexOf
  }
  if (pointers.indexOf(arr) === -1) {
    pointers.push(arr, 0)
  }
  var cursor = pointers[pointers.indexOf(arr) + 1]
  if (Object.prototype.toString.call(arr) !== '[object Array]') {
    var ct = 0
    for (var k in arr) {
      if (ct === cursor) {
        return k
      }
      ct++
    }
    // Empty
    return false
  }
  if (arr.length === 0) {
    return false
  }
  return cursor
}
/**
 * next for phpjs
 */
function next (arr) {
  //  discuss at: http://locutus.io/php/next/
  // original by: Brett Zamir (http://brett-zamir.me)
  //      note 1: Uses global: locutus to store the array pointer
  //   example 1: var $transport = ['foot', 'bike', 'car', 'plane']
  //   example 1: next($transport)
  //   example 1: next($transport)
  //   returns 1: 'car'
  var $global = (typeof window !== 'undefined' ? window : global)
  $global.$locutus = $global.$locutus || {}
  var $locutus = $global.$locutus
  $locutus.php = $locutus.php || {}
  $locutus.php.pointers = $locutus.php.pointers || []
  var pointers = $locutus.php.pointers
  var indexOf = function (value) {
    for (var i = 0, length = this.length; i < length; i++) {
      if (this[i] === value) {
        return i
      }
    }
    return -1
  }
  if (!pointers.indexOf) {
    pointers.indexOf = indexOf
  }
  if (pointers.indexOf(arr) === -1) {
    pointers.push(arr, 0)
  }
  var arrpos = pointers.indexOf(arr)
  var cursor = pointers[arrpos + 1]
  if (Object.prototype.toString.call(arr) !== '[object Array]') {
    var ct = 0
    for (var k in arr) {
      if (ct === cursor + 1) {
        pointers[arrpos + 1] += 1
        return arr[k]
      }
      ct++
    }
    // End
    return false
  }
  if (arr.length === 0 || cursor === (arr.length - 1)) {
    return false
  }
  pointers[arrpos + 1] += 1
  return arr[pointers[arrpos + 1]]
}

/**
 * prev for phpjs
 */
function prev (arr) {
  //  discuss at: http://locutus.io/php/prev/
  // original by: Brett Zamir (http://brett-zamir.me)
  //      note 1: Uses global: locutus to store the array pointer
  //   example 1: var $transport = ['foot', 'bike', 'car', 'plane']
  //   example 1: prev($transport)
  //   returns 1: false
  var $global = (typeof window !== 'undefined' ? window : global)
  $global.$locutus = $global.$locutus || {}
  var $locutus = $global.$locutus
  $locutus.php = $locutus.php || {}
  $locutus.php.pointers = $locutus.php.pointers || []
  var pointers = $locutus.php.pointers
  var indexOf = function (value) {
    for (var i = 0, length = this.length; i < length; i++) {
      if (this[i] === value) {
        return i
      }
    }
    return -1
  }
  if (!pointers.indexOf) {
    pointers.indexOf = indexOf
  }
  var arrpos = pointers.indexOf(arr)
  var cursor = pointers[arrpos + 1]
  if (pointers.indexOf(arr) === -1 || cursor === 0) {
    return false
  }
  if (Object.prototype.toString.call(arr) !== '[object Array]') {
    var ct = 0
    for (var k in arr) {
      if (ct === cursor - 1) {
        pointers[arrpos + 1] -= 1
        return arr[k]
      }
      ct++
    }
    // Shouldn't reach here
  }
  if (arr.length === 0) {
    return false
  }
  pointers[arrpos + 1] -= 1
  return arr[pointers[arrpos + 1]]
}

/**
 * range for phpjs
 */
function range (low, high, step) {
  //  discuss at: http://locutus.io/php/range/
  // original by: Waldo Malqui Silva (http://waldo.malqui.info)
  //   example 1: range ( 0, 12 )
  //   returns 1: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  //   example 2: range( 0, 100, 10 )
  //   returns 2: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
  //   example 3: range( 'a', 'i' )
  //   returns 3: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']
  //   example 4: range( 'c', 'a' )
  //   returns 4: ['c', 'b', 'a']
  var matrix = []
  var iVal
  var endval
  var plus
  var walker = step || 1
  var chars = false
  if (!isNaN(low) && !isNaN(high)) {
    iVal = low
    endval = high
  } else if (isNaN(low) && isNaN(high)) {
    chars = true
    iVal = low.charCodeAt(0)
    endval = high.charCodeAt(0)
  } else {
    iVal = (isNaN(low) ? 0 : low)
    endval = (isNaN(high) ? 0 : high)
  }
  plus = !(iVal > endval)
  if (plus) {
    while (iVal <= endval) {
      matrix.push(((chars) ? String.fromCharCode(iVal) : iVal))
      iVal += walker
    }
  } else {
    while (iVal >= endval) {
      matrix.push(((chars) ? String.fromCharCode(iVal) : iVal))
      iVal -= walker
    }
  }
  return matrix
}

/**
 * reset for phpjs
 */
function reset (arr) {
  //  discuss at: http://locutus.io/php/reset/
  // original by: Kevin van Zonneveld (http://kvz.io)
  // bugfixed by: Legaev Andrey
  //  revised by: Brett Zamir (http://brett-zamir.me)
  //      note 1: Uses global: locutus to store the array pointer
  //   example 1: reset({0: 'Kevin', 1: 'van', 2: 'Zonneveld'})
  //   returns 1: 'Kevin'
  var $global = (typeof window !== 'undefined' ? window : global)
  $global.$locutus = $global.$locutus || {}
  var $locutus = $global.$locutus
  $locutus.php = $locutus.php || {}
  $locutus.php.pointers = $locutus.php.pointers || []
  var pointers = $locutus.php.pointers
  var indexOf = function (value) {
    for (var i = 0, length = this.length; i < length; i++) {
      if (this[i] === value) {
        return i
      }
    }
    return -1
  }
  if (!pointers.indexOf) {
    pointers.indexOf = indexOf
  }
  if (pointers.indexOf(arr) === -1) {
    pointers.push(arr, 0)
  }
  var arrpos = pointers.indexOf(arr)
  if (Object.prototype.toString.call(arr) !== '[object Array]') {
    for (var k in arr) {
      if (pointers.indexOf(arr) === -1) {
        pointers.push(arr, 0)
      } else {
        pointers[arrpos + 1] = 0
      }
      return arr[k]
    }
    // Empty
    return false
  }
  if (arr.length === 0) {
    return false
  }
  pointers[arrpos + 1] = 0
  return arr[pointers[arrpos + 1]]
}

/**
 * $_GET for phpjs
 */
function str_replace (search, replace, subject, countObj) {
  var i = 0
  var j = 0
  var temp = ''
  var repl = ''
  var sl = 0
  var fl = 0
  var f = [].concat(search)
  var r = [].concat(replace)
  var s = subject
  var ra = Object.prototype.toString.call(r) === '[object Array]'
  var sa = Object.prototype.toString.call(s) === '[object Array]'
  s = [].concat(s)
  var $global = (typeof window !== 'undefined' ? window : global)
  $global.$locutus = $global.$locutus || {}
  var $locutus = $global.$locutus
  $locutus.php = $locutus.php || {}
  if (typeof (search) === 'object' && typeof (replace) === 'string') {
    temp = replace
    replace = []
    for (i = 0; i < search.length; i += 1) {
      replace[i] = temp
    }
    temp = ''
    r = [].concat(replace)
    ra = Object.prototype.toString.call(r) === '[object Array]'
  }
  if (typeof countObj !== 'undefined') {
    countObj.value = 0
  }
  for (i = 0, sl = s.length; i < sl; i++) {
    if (s[i] === '') {
      continue
    }
    for (j = 0, fl = f.length; j < fl; j++) {
      temp = s[i] + ''
      repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0]
      s[i] = (temp).split(f[j]).join(repl)
      if (typeof countObj !== 'undefined') {
        countObj.value += ((temp.split(f[j])).length - 1)
      }
    }
  }
  return sa ? s : s[0]
};
/**
 * utf8_decode for phpjs
 */
function utf8_decode (strData) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/utf8_decode/
  // original by: Webtoolkit.info (http://www.webtoolkit.info/)
  //    input by: Aman Gupta
  //    input by: Brett Zamir (http://brett-zamir.me)
  // improved by: Kevin van Zonneveld (http://kvz.io)
  // improved by: Norman "zEh" Fuchs
  // bugfixed by: hitwork
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  // bugfixed by: kirilloid
  // bugfixed by: w35l3y (http://www.wesley.eti.br)
  //   example 1: utf8_decode('Kevin van Zonneveld')
  //   returns 1: 'Kevin van Zonneveld'
  var tmpArr = []
  var i = 0
  var c1 = 0
  var seqlen = 0
  strData += ''
  while (i < strData.length) {
    c1 = strData.charCodeAt(i) & 0xFF
    seqlen = 0
    // http://en.wikipedia.org/wiki/UTF-8#Codepage_layout
    if (c1 <= 0xBF) {
      c1 = (c1 & 0x7F)
      seqlen = 1
    } else if (c1 <= 0xDF) {
      c1 = (c1 & 0x1F)
      seqlen = 2
    } else if (c1 <= 0xEF) {
      c1 = (c1 & 0x0F)
      seqlen = 3
    } else {
      c1 = (c1 & 0x07)
      seqlen = 4
    }
    for (var ai = 1; ai < seqlen; ++ai) {
      c1 = ((c1 << 0x06) | (strData.charCodeAt(ai + i) & 0x3F))
    }
    if (seqlen === 4) {
      c1 -= 0x10000
      tmpArr.push(String.fromCharCode(0xD800 | ((c1 >> 10) & 0x3FF)))
      tmpArr.push(String.fromCharCode(0xDC00 | (c1 & 0x3FF)))
    } else {
      tmpArr.push(String.fromCharCode(c1))
    }
    i += seqlen
  }
  return tmpArr.join('')
}
/**
 * utf8_encode
 */
function utf8_encode (argString) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/utf8_encode/
  // original by: Webtoolkit.info (http://www.webtoolkit.info/)
  // improved by: Kevin van Zonneveld (http://kvz.io)
  // improved by: sowberry
  // improved by: Jack
  // improved by: Yves Sucaet
  // improved by: kirilloid
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  // bugfixed by: Ulrich
  // bugfixed by: Rafał Kukawski (http://blog.kukawski.pl)
  // bugfixed by: kirilloid
  //   example 1: utf8_encode('Kevin van Zonneveld')
  //   returns 1: 'Kevin van Zonneveld'
  if (argString === null || typeof argString === 'undefined') {
    return ''
  }
  // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  var string = (argString + '')
  var utftext = ''
  var start
  var end
  var stringl = 0
  start = end = 0
  stringl = string.length
  for (var n = 0; n < stringl; n++) {
    var c1 = string.charCodeAt(n)
    var enc = null
    if (c1 < 128) {
      end++
    } else if (c1 > 127 && c1 < 2048) {
      enc = String.fromCharCode(
        (c1 >> 6) | 192, (c1 & 63) | 128
      )
    } else if ((c1 & 0xF800) !== 0xD800) {
      enc = String.fromCharCode(
        (c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
      )
    } else {
      // surrogate pairs
      if ((c1 & 0xFC00) !== 0xD800) {
        throw new RangeError('Unmatched trail surrogate at ' + n)
      }
      var c2 = string.charCodeAt(++n)
      if ((c2 & 0xFC00) !== 0xDC00) {
        throw new RangeError('Unmatched lead surrogate at ' + (n - 1))
      }
      c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000
      enc = String.fromCharCode(
        (c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
      )
    }
    if (enc !== null) {
      if (end > start) {
        utftext += string.slice(start, end)
      }
      utftext += enc
      start = end = n + 1
    }
  }
  if (end > start) {
    utftext += string.slice(start, stringl)
  }
  return utftext
}
/**
 * xdiff_string_diff for phpjs
 */
function xdiff_string_diff (oldData, newData, contextLines, minimal) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/xdiff_string_diff
  // original by: Brett Zamir (http://brett-zamir.me)
  //    based on: Imgen Tata (http://www.myipdf.com/)
  // bugfixed by: Imgen Tata (http://www.myipdf.com/)
  // improved by: Brett Zamir (http://brett-zamir.me)
  //      note 1: The minimal argument is not currently supported
  //   example 1: xdiff_string_diff('', 'Hello world!')
  //   returns 1: '@@ -0,0 +1,1 @@\n+Hello world!'
  // (This code was done by Imgen Tata; I have only reformatted for use in Locutus)
  // See http://en.wikipedia.org/wiki/Diff#Unified_format
  var i = 0
  var j = 0
  var k = 0
  var oriHunkStart
  var newHunkStart
  var oriHunkEnd
  var newHunkEnd
  var oriHunkLineNo
  var newHunkLineNo
  var oriHunkSize
  var newHunkSize
  var MAX_CONTEXT_LINES = Number.POSITIVE_INFINITY // Potential configuration
  var MIN_CONTEXT_LINES = 0
  var DEFAULT_CONTEXT_LINES = 3
  var HEADER_PREFIX = '@@ ' //
  var HEADER_SUFFIX = ' @@'
  var ORIGINAL_INDICATOR = '-'
  var NEW_INDICATOR = '+'
  var RANGE_SEPARATOR = ','
  var CONTEXT_INDICATOR = ' '
  var DELETION_INDICATOR = '-'
  var ADDITION_INDICATOR = '+'
  var oriLines
  var newLines
  var NEW_LINE = '\n'
  var _trim = function (text) {
    if (typeof text !== 'string') {
      throw new Error('String parameter required')
    }
    return text.replace(/(^\s*)|(\s*$)/g, '')
  }
  var _verifyType = function (type) {
    var args = arguments
    var argsLen = arguments.length
    var basicTypes = ['number', 'boolean', 'string', 'function', 'object', 'undefined']
    var basicType
    var i
    var j
    var typeOfType = typeof type
    if (typeOfType !== 'string' && typeOfType !== 'function') {
      throw new Error('Bad type parameter')
    }
    if (argsLen < 2) {
      throw new Error('Too few arguments')
    }
    if (typeOfType === 'string') {
      type = _trim(type)
      if (type === '') {
        throw new Error('Bad type parameter')
      }
      for (j = 0; j < basicTypes.length; j++) {
        basicType = basicTypes[j]
        if (basicType === type) {
          for (i = 1; i < argsLen; i++) {
            if (typeof args[i] !== type) {
              throw new Error('Bad type')
            }
          }
          return
        }
      }
      throw new Error('Bad type parameter')
    }
    // Not basic type. we need to use instanceof operator
    for (i = 1; i < argsLen; i++) {
      if (!(args[i] instanceof type)) {
        throw new Error('Bad type')
      }
    }
  }
  var _hasValue = function (array, value) {
    var i
    _verifyType(Array, array)
    for (i = 0; i < array.length; i++) {
      if (array[i] === value) {
        return true
      }
    }
    return false
  }
  var _areTypeOf = function (type) {
    var args = arguments
    var argsLen = arguments.length
    var basicTypes = ['number', 'boolean', 'string', 'function', 'object', 'undefined']
    var basicType
    var i
    var j
    var typeOfType = typeof type
    if (typeOfType !== 'string' && typeOfType !== 'function') {
      throw new Error('Bad type parameter')
    }
    if (argsLen < 2) {
      throw new Error('Too few arguments')
    }
    if (typeOfType === 'string') {
      type = _trim(type)
      if (type === '') {
        return false
      }
      for (j = 0; j < basicTypes.length; j++) {
        basicType = basicTypes[j]
        if (basicType === type) {
          for (i = 1; i < argsLen; i++) {
            if (typeof args[i] !== type) {
              return false
            }
          }
          return true
        }
      }
      throw new Error('Bad type parameter')
    }
    // Not basic type. we need to use instanceof operator
    for (i = 1; i < argsLen; i++) {
      if (!(args[i] instanceof type)) {
        return false
      }
    }
    return true
  }
  var _getInitializedArray = function (arraySize, initValue) {
    var array = []
    var i
    _verifyType('number', arraySize)
    for (i = 0; i < arraySize; i++) {
      array.push(initValue)
    }
    return array
  }
  var _splitIntoLines = function (text) {
    _verifyType('string', text)
    if (text === '') {
      return []
    }
    return text.split('\n')
  }
  var _isEmptyArray = function (obj) {
    return _areTypeOf(Array, obj) && obj.length === 0
  }
  /**
   * Finds longest common sequence between two sequences
   * @see {@link http://wordaligned.org/articles/longest-common-subsequence}
   */
  var _findLongestCommonSequence = function (seq1, seq2, seq1IsInLcs, seq2IsInLcs) {
    if (!_areTypeOf(Array, seq1, seq2)) {
      throw new Error('Array parameters are required')
    }
    // Deal with edge case
    if (_isEmptyArray(seq1) || _isEmptyArray(seq2)) {
      return []
    }
    // Function to calculate lcs lengths
    var lcsLens = function (xs, ys) {
      var i
      var j
      var prev
      var curr = _getInitializedArray(ys.length + 1, 0)
      for (i = 0; i < xs.length; i++) {
        prev = curr.slice(0)
        for (j = 0; j < ys.length; j++) {
          if (xs[i] === ys[j]) {
            curr[j + 1] = prev[j] + 1
          } else {
            curr[j + 1] = Math.max(curr[j], prev[j + 1])
          }
        }
      }
      return curr
    }
    // Function to find lcs and fill in the array to indicate the optimal longest common sequence
    var _findLcs = function (xs, xidx, xIsIn, ys) {
      var i
      var xb
      var xe
      var llB
      var llE
      var pivot
      var max
      var yb
      var ye
      var nx = xs.length
      var ny = ys.length
      if (nx === 0) {
        return []
      }
      if (nx === 1) {
        if (_hasValue(ys, xs[0])) {
          xIsIn[xidx] = true
          return [xs[0]]
        }
        return []
      }
      i = Math.floor(nx / 2)
      xb = xs.slice(0, i)
      xe = xs.slice(i)
      llB = lcsLens(xb, ys)
      llE = lcsLens(xe.slice(0)
        .reverse(), ys.slice(0)
        .reverse())
      pivot = 0
      max = 0
      for (j = 0; j <= ny; j++) {
        if (llB[j] + llE[ny - j] > max) {
          pivot = j
          max = llB[j] + llE[ny - j]
        }
      }
      yb = ys.slice(0, pivot)
      ye = ys.slice(pivot)
      return _findLcs(xb, xidx, xIsIn, yb).concat(_findLcs(xe, xidx + i, xIsIn, ye))
    }
    // Fill in seq1IsInLcs to find the optimal longest common subsequence of first sequence
    _findLcs(seq1, 0, seq1IsInLcs, seq2)
    // Fill in seq2IsInLcs to find the optimal longest common subsequence
    // of second sequence and return the result
    return _findLcs(seq2, 0, seq2IsInLcs, seq1)
  }
  // First, check the parameters
  if (_areTypeOf('string', oldData, newData) === false) {
    return false
  }
  if (oldData === newData) {
    return ''
  }
  if (typeof contextLines !== 'number' ||
    contextLines > MAX_CONTEXT_LINES ||
    contextLines < MIN_CONTEXT_LINES) {
    contextLines = DEFAULT_CONTEXT_LINES
  }
  oriLines = _splitIntoLines(oldData)
  newLines = _splitIntoLines(newData)
  var oriLen = oriLines.length
  var newLen = newLines.length
  var oriIsInLcs = _getInitializedArray(oriLen, false)
  var newIsInLcs = _getInitializedArray(newLen, false)
  var lcsLen = _findLongestCommonSequence(oriLines, newLines, oriIsInLcs, newIsInLcs).length
  var unidiff = ''
  if (lcsLen === 0) {
    // No common sequence
    unidiff = [
      HEADER_PREFIX,
      ORIGINAL_INDICATOR,
      (oriLen > 0 ? '1' : '0'),
      RANGE_SEPARATOR,
      oriLen,
      ' ',
      NEW_INDICATOR,
      (newLen > 0 ? '1' : '0'),
      RANGE_SEPARATOR,
      newLen,
      HEADER_SUFFIX
    ].join('')
    for (i = 0; i < oriLen; i++) {
      unidiff += NEW_LINE + DELETION_INDICATOR + oriLines[i]
    }
    for (j = 0; j < newLen; j++) {
      unidiff += NEW_LINE + ADDITION_INDICATOR + newLines[j]
    }
    return unidiff
  }
  var leadingContext = []
  var trailingContext = []
  var actualLeadingContext = []
  var actualTrailingContext = []
  // Regularize leading context by the contextLines parameter
  var regularizeLeadingContext = function (context) {
    if (context.length === 0 || contextLines === 0) {
      return []
    }
    var contextStartPos = Math.max(context.length - contextLines, 0)
    return context.slice(contextStartPos)
  }
  // Regularize trailing context by the contextLines parameter
  var regularizeTrailingContext = function (context) {
    if (context.length === 0 || contextLines === 0) {
      return []
    }
    return context.slice(0, Math.min(contextLines, context.length))
  }
  // Skip common lines in the beginning
  while (i < oriLen && oriIsInLcs[i] === true && newIsInLcs[i] === true) {
    leadingContext.push(oriLines[i])
    i++
  }
  j = i
  // The index in the longest common sequence
  k = i
  oriHunkStart = i
  newHunkStart = j
  oriHunkEnd = i
  newHunkEnd = j
  while (i < oriLen || j < newLen) {
    while (i < oriLen && oriIsInLcs[i] === false) {
      i++
    }
    oriHunkEnd = i
    while (j < newLen && newIsInLcs[j] === false) {
      j++
    }
    newHunkEnd = j
    // Find the trailing context
    trailingContext = []
    while (i < oriLen && oriIsInLcs[i] === true && j < newLen && newIsInLcs[j] === true) {
      trailingContext.push(oriLines[i])
      k++
      i++
      j++
    }
    if (k >= lcsLen || // No more in longest common lines
      trailingContext.length >= 2 * contextLines) {
      // Context break found
      if (trailingContext.length < 2 * contextLines) {
        // It must be last block of common lines but not a context break
        trailingContext = []
        // Force break out
        i = oriLen
        j = newLen
        // Update hunk ends to force output to the end
        oriHunkEnd = oriLen
        newHunkEnd = newLen
      }
      // Output the diff hunk
      // Trim the leading and trailing context block
      actualLeadingContext = regularizeLeadingContext(leadingContext)
      actualTrailingContext = regularizeTrailingContext(trailingContext)
      oriHunkStart -= actualLeadingContext.length
      newHunkStart -= actualLeadingContext.length
      oriHunkEnd += actualTrailingContext.length
      newHunkEnd += actualTrailingContext.length
      oriHunkLineNo = oriHunkStart + 1
      newHunkLineNo = newHunkStart + 1
      oriHunkSize = oriHunkEnd - oriHunkStart
      newHunkSize = newHunkEnd - newHunkStart
      // Build header
      unidiff += [
        HEADER_PREFIX,
        ORIGINAL_INDICATOR,
        oriHunkLineNo,
        RANGE_SEPARATOR,
        oriHunkSize,
        ' ',
        NEW_INDICATOR,
        newHunkLineNo,
        RANGE_SEPARATOR,
        newHunkSize,
        HEADER_SUFFIX,
        NEW_LINE
      ].join('')
      // Build the diff hunk content
      while (oriHunkStart < oriHunkEnd || newHunkStart < newHunkEnd) {
        if (oriHunkStart < oriHunkEnd &&
          oriIsInLcs[oriHunkStart] === true &&
          newIsInLcs[newHunkStart] === true) {
          // The context line
          unidiff += CONTEXT_INDICATOR + oriLines[oriHunkStart] + NEW_LINE
          oriHunkStart++
          newHunkStart++
        } else if (oriHunkStart < oriHunkEnd && oriIsInLcs[oriHunkStart] === false) {
          // The deletion line
          unidiff += DELETION_INDICATOR + oriLines[oriHunkStart] + NEW_LINE
          oriHunkStart++
        } else if (newHunkStart < newHunkEnd && newIsInLcs[newHunkStart] === false) {
          // The additional line
          unidiff += ADDITION_INDICATOR + newLines[newHunkStart] + NEW_LINE
          newHunkStart++
        }
      }
      // Update hunk position and leading context
      oriHunkStart = i
      newHunkStart = j
      leadingContext = trailingContext
    }
  }
  // Trim the trailing new line if it exists
  if (unidiff.length > 0 && unidiff.charAt(unidiff.length) === NEW_LINE) {
    unidiff = unidiff.slice(0, -1)
  }
  return unidiff
}

/**
 * xdiff_string_patch for phpjs
 */
function xdiff_string_patch (originalStr, patch, flags, errorObj) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/xdiff_string_patch/
  // original by: Brett Zamir (http://brett-zamir.me)
  // improved by: Steven Levithan (stevenlevithan.com)
  //      note 1: The XDIFF_PATCH_IGNORESPACE flag and the error argument are not
  //      note 1: currently supported.
  //      note 2: This has not been tested exhaustively yet.
  //      note 3: The errorObj parameter (optional) if used must be passed in as a
  //      note 3: object. The errors will then be written by reference into it's `value` property
  //   example 1: xdiff_string_patch('', '@@ -0,0 +1,1 @@\n+Hello world!')
  //   returns 1: 'Hello world!'
  // First two functions were adapted from Steven Levithan, also under an MIT license
  // Adapted from XRegExp 1.5.0
  // (c) 2007-2010 Steven Levithan
  // MIT License
  // <http://xregexp.com>
  var _getNativeFlags = function (regex) {
    // Proposed for ES4; included in AS3
    return [
      (regex.global ? 'g' : ''),
      (regex.ignoreCase ? 'i' : ''),
      (regex.multiline ? 'm' : ''),
      (regex.extended ? 'x' : ''),
      (regex.sticky ? 'y' : '')
    ].join('')
  }
  var _cbSplit = function (string, sep) {
    // If separator `s` is not a regex, use the native `split`
    if (!(sep instanceof RegExp)) {
      // Had problems to get it to work here using prototype test
      return String.prototype.split.apply(string, arguments)
    }
    var str = String(string)
    var output = []
    var lastLastIndex = 0
    var match
    var lastLength
    var limit = Infinity
    var x = sep._xregexp
    // This is required if not `s.global`, and it avoids needing to set `s.lastIndex` to zero
    // and restore it to its original value when we're done using the regex
    // Brett paring down
    var s = new RegExp(sep.source, _getNativeFlags(sep) + 'g')
    if (x) {
      s._xregexp = {
        source: x.source,
        captureNames: x.captureNames ? x.captureNames.slice(0) : null
      }
    }
    while ((match = s.exec(str))) {
      // Run the altered `exec` (required for `lastIndex` fix, etc.)
      if (s.lastIndex > lastLastIndex) {
        output.push(str.slice(lastLastIndex, match.index))
        if (match.length > 1 && match.index < str.length) {
          Array.prototype.push.apply(output, match.slice(1))
        }
        lastLength = match[0].length
        lastLastIndex = s.lastIndex
        if (output.length >= limit) {
          break
        }
      }
      if (s.lastIndex === match.index) {
        s.lastIndex++
      }
    }
    if (lastLastIndex === str.length) {
      if (!s.test('') || lastLength) {
        output.push('')
      }
    } else {
      output.push(str.slice(lastLastIndex))
    }
    return output.length > limit ? output.slice(0, limit) : output
  }
  var i = 0
  var ll = 0
  var ranges = []
  var lastLinePos = 0
  var firstChar = ''
  var rangeExp = /^@@\s+-(\d+),(\d+)\s+\+(\d+),(\d+)\s+@@$/
  var lineBreaks = /\r?\n/
  var lines = _cbSplit(patch.replace(/(\r?\n)+$/, ''), lineBreaks)
  var origLines = _cbSplit(originalStr, lineBreaks)
  var newStrArr = []
  var linePos = 0
  var errors = ''
  var optTemp = 0 // Both string & integer (constant) input is allowed
  var OPTS = {
    // Unsure of actual PHP values, so better to rely on string
    'XDIFF_PATCH_NORMAL': 1,
    'XDIFF_PATCH_REVERSE': 2,
    'XDIFF_PATCH_IGNORESPACE': 4
  }
  // Input defaulting & sanitation
  if (typeof originalStr !== 'string' || !patch) {
    return false
  }
  if (!flags) {
    flags = 'XDIFF_PATCH_NORMAL'
  }
  if (typeof flags !== 'number') {
    // Allow for a single string or an array of string flags
    flags = [].concat(flags)
    for (i = 0; i < flags.length; i++) {
      // Resolve string input to bitwise e.g. 'XDIFF_PATCH_NORMAL' becomes 1
      if (OPTS[flags[i]]) {
        optTemp = optTemp | OPTS[flags[i]]
      }
    }
    flags = optTemp
  }
  if (flags & OPTS.XDIFF_PATCH_NORMAL) {
    for (i = 0, ll = lines.length; i < ll; i++) {
      ranges = lines[i].match(rangeExp)
      if (ranges) {
        lastLinePos = linePos
        linePos = ranges[1] - 1
        while (lastLinePos < linePos) {
          newStrArr[newStrArr.length] = origLines[lastLinePos++]
        }
        while (lines[++i] && (rangeExp.exec(lines[i])) === null) {
          firstChar = lines[i].charAt(0)
          switch (firstChar) {
            case '-':
            // Skip including that line
              ++linePos
              break
            case '+':
              newStrArr[newStrArr.length] = lines[i].slice(1)
              break
            case ' ':
              newStrArr[newStrArr.length] = origLines[linePos++]
              break
            default:
            // Reconcile with returning errrors arg?
              throw new Error('Unrecognized initial character in unidiff line')
          }
        }
        if (lines[i]) {
          i--
        }
      }
    }
    while (linePos > 0 && linePos < origLines.length) {
      newStrArr[newStrArr.length] = origLines[linePos++]
    }
  } else if (flags & OPTS.XDIFF_PATCH_REVERSE) {
    // Only differs from above by a few lines
    for (i = 0, ll = lines.length; i < ll; i++) {
      ranges = lines[i].match(rangeExp)
      if (ranges) {
        lastLinePos = linePos
        linePos = ranges[3] - 1
        while (lastLinePos < linePos) {
          newStrArr[newStrArr.length] = origLines[lastLinePos++]
        }
        while (lines[++i] && (rangeExp.exec(lines[i])) === null) {
          firstChar = lines[i].charAt(0)
          switch (firstChar) {
            case '-':
              newStrArr[newStrArr.length] = lines[i].slice(1)
              break
            case '+':
            // Skip including that line
              ++linePos
              break
            case ' ':
              newStrArr[newStrArr.length] = origLines[linePos++]
              break
            default:
            // Reconcile with returning errrors arg?
              throw new Error('Unrecognized initial character in unidiff line')
          }
        }
        if (lines[i]) {
          i--
        }
      }
    }
    while (linePos > 0 && linePos < origLines.length) {
      newStrArr[newStrArr.length] = origLines[linePos++]
    }
  }
  if (errorObj) {
    errorObj.value = errors
  }
  return newStrArr.join('\n')
}

// Checks if the object or class has a property.
//
// @param object value
// @param string property
// @return bool

function property_exists(value, property) {

  // How do I check if an object has a specific property in JavaScript ?
  // https://stackoverflow.com/a/77782005/82126

  if (property in value) {
    return true;
  }

  return false;
}

export {
array_change_key_case,
array_chunk,
array_combine,
array_count_values,
array_diff,
array_diff_assoc,
array_diff_key,
array_diff_uassoc,
array_diff_ukey,
array_fill,
array_fill_keys,
array_filter,
array_flip,
array_intersect,
array_intersect_assoc,
array_intersect_key,
array_intersect_uassoc,
array_intersect_ukey,
array_key_exists,
array_keys,
array_map,
array_merge,
array_multisort,
array_pad,
array_pop,
array_product,
array_push,
array_rand,
array_reduce,
array_replace,
array_replace_recursive,
array_reverse,
array_search,
array_shift,
array_sum,
array_udiff,
array_udiff_assoc,
array_udiff_uassoc,
array_uintersect,
array_uintersect_uassoc,
array_unique,
array_unshift,
array_values,
array_walk,
array_walk_recursive,
count,
current,
date,
each,
empty,
end,
explode,
fnmatch,
in_array,
is_array,
is_null,
key,
next,
prev,
property_exists,
range,
reset,
str_replace,
time,
utf8_decode,
utf8_encode,
xdiff_string_diff,
xdiff_string_patch
};

