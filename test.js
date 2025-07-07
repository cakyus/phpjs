import { assert } from './libtest.js';
import {
  is_array,
  fnmatch,
  empty,
  property_exists
} from './libphp.js';

test_is_array();
test_fnmatch();
test_empty();
test_property_exists();

function test_property_exists() {
  const o = {};
  o.name = 'John';
  assert(true, property_exists(o, 'name'));
  assert(false, property_exists(o, 'email'));
}

function test_is_array() {

  assert(true, is_array([]));

  assert(false, is_array(0));
  assert(false, is_array(''));
  assert(false, is_array({}));
  assert(false, is_array(null));
  assert(false, is_array(undefined));
}

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
