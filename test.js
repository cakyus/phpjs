import { assert } from './libtest.js';
import {
   empty
 , STR_PAD_BOTH
 , STR_PAD_LEFT
 , STR_PAD_RIGHT
 , explode
 , fnmatch
 , get_class_vars
 , gettype
 , in_array
 , is_array
 , is_string
 , property_exists
 , str_pad
 , str_replace
 , strtolower
 , strtoupper
 , substr
} from './libphp.js';

test_is_array();
test_fnmatch();
test_empty();
test_property_exists();
test_explode();
test_in_array();
test_substr();
test_strtoupper();
test_strtolower();
test_get_class_vars();
test_str_pad();
test_gettype();
test_str_replace();
test_is_string();

function test_is_string() {

  assert(false, is_string(1));
  assert(false, is_string(1.5));
  assert(false, is_string(null));
  assert(false, is_string({}));
  assert(true,  is_string('foo'));
  assert(true,  is_string('1'));

  assert(false, is_string([1,2]));
  assert(false, is_string(undefined));
  assert(false, is_string(true));
}

function test_str_replace() {

  assert('b', str_replace('a', 'b', 'a'));
  assert('bb', str_replace('a', 'b', 'ab'));
  assert('bb', str_replace('a', 'b', 'ba'));
  assert('abc', str_replace('d', 'b', 'adc'));
  assert('abcb', str_replace('d', 'b', 'adcd'));
  assert('babcb', str_replace('d', 'b', 'dadcd'));

  assert('cd', str_replace('ab', '', 'abcd'));
  assert('cdcd', str_replace('ab', '', 'abcdabcd'));
}

function test_gettype() {

  assert('integer', gettype(1));
  assert('double', gettype(1.5));
  assert('NULL', gettype(null));
  assert('object', gettype({}));
  assert('string', gettype('foo'));

  assert('array', gettype([1,2]));
  assert('NULL', gettype(undefined));
  assert('boolean', gettype(true));
}

function test_str_pad() {
  const input = 'Alien';
  assert('Alien     ', str_pad(input, 10));
  assert('-=-=-Alien', str_pad(input, 10, '-=', STR_PAD_LEFT));
  assert('__Alien___', str_pad(input, 10, '_', STR_PAD_BOTH));
  assert('Alien_', str_pad(input, 6, '___'));
  assert('Alien', str_pad(input, 3, '*'));
}

function test_get_class_vars() {
  const o = {
      var1: 1
    , var2: 2
  };
  assert(['var1','var2'], get_class_vars(o));
}

function test_strtolower() {

  assert('abc', strtolower('ABC'));

  // must not change t
  const t = 'AB';
  assert('ab', strtolower(t));
}

function test_strtoupper() {

  assert('ABC', strtoupper('abc'));
  assert('ABCD', strtoupper('aBCd'));

  // must not change t
  const t = 'ab';
  assert('AB', strtoupper(t));
}

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

  assert(['a','b'], explode('=','a=b'));
  assert(['a','b=c'], explode('=','a=b=c',2));
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

