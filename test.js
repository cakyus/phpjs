import {
  fnmatch,
  empty
} from './libphp.js';

test_fnmatch();
test_empty();

function test_fnmatch() {
  // asteric
  assert(true, fnmatch('a*d', 'abcd'));
  assert(true, fnmatch('*d', 'abcd'));
  assert(true, fnmatch('a*', 'abcd'));
  assert(true, fnmatch('a**', 'abcd'));
}

function test_empty() {
  assert(true, empty(0));
  assert(true, empty(''));
  assert(true, empty([]));
  assert(true, empty({}));
  assert(true, empty(null));
  assert(true, empty(undefined));
}

function assert(expect, result, message) {

  let expect_type = typeof(expect);
  let result_type = typeof(result);

  if (expect_type != result_type) {
    throw Error('expect '+ expect_type + ' result ' + result_type + '.');
  } else if (expect_type == 'boolean') {
    if (expect == result) {
      // do nothing
    } else if (expect == true) {
      throw Error('expect false result true.');
    } else {
      throw Error('expect true result false.');
    }
  } else if (expect_type == 'string') {
    if (expect == result) {
      return true;
    } else {
      return false;
    }
  } else if (expect_type == 'number') {
    if (expect == result) {
      return true;
    } else {
      return false;
    }
  } else {
    throw Error('Unknown type. ' + type);
  }
}
