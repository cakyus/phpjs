import { assert } from './libtest.js';
import {
  empty
, explode
, fnmatch
, in_array
, is_array
, property_exists
, substr
} from './libphp.js';

test_is_array();
test_fnmatch();
test_empty();
test_property_exists();
test_explode();
test_in_array();
test_substr();

function test_substr() {
  assert('bcdef', substr('abcdef', 1));
  assert('ab', substr('abcdef', 0, 2));
  assert('bcd', substr('abcdef', 1, 3));
  assert('f', substr('abcdef', -1));
  assert('d', substr('abcdef', -3, 1));
}

function test_in_array() {
  assert(true, in_array('a', ['a','b','c']));
  assert(false, in_array('d', ['a','b','c']));
}

function test_explode() {

  assert(['a','b'], explode(' ','a b'));
  assert(['a','b','c'], explode(' ','a b c',3));

  assert(['a','b c'], explode(' ','a b c',2));
  assert(['a','b','c d'], explode(' ','a b c d',3));
  assert(['a','b','c d e'], explode(' ','a b c d e',3));
}

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

