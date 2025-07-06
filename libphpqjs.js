// libphpqjs.js

import {
  array_change_key_case
, array_chunk
, array_combine
, array_count_values
, array_diff
, array_diff_assoc
, array_diff_key
, array_diff_uassoc
, array_diff_ukey
, array_fill
, array_fill_keys
, array_filter
, array_flip
, array_intersect
, array_intersect_assoc
, array_intersect_key
, array_intersect_uassoc
, array_intersect_ukey
, array_key_exists
, array_keys
, array_map
, array_merge
, array_multisort
, array_pad
, array_pop
, array_product
, array_push
, array_rand
, array_reduce
, array_replace
, array_replace_recursive
, array_reverse
, array_search
, array_shift
, array_sum
, array_udiff
, array_udiff_assoc
, array_udiff_uassoc
, array_uintersect
, array_uintersect_uassoc
, array_unique
, array_unshift
, array_values
, array_walk
, array_walk_recursive
, count
, current
, date
, each
, empty
, end
, explode
, fnmatch
, in_array
, is_null
, is_array
, key
, next
, prev
, range
, reset
, str_replace
, time
, utf8_decode
, utf8_encode
, xdiff_string_diff
, xdiff_string_patch
} from './libphp.js';

import * as os from 'qjs:os';
import * as std from 'qjs:std';

// @return bool

async function is_file(file) {
  let result = await stat(file);
  if (result === false) {
    return false;
  }
  return true;
}

// Get stat
// @param string filename
// @return array|false
//
// No  Key     Description
// 0   dev     device number ***
// 1   ino     inode number ****
// 2   mode    inode protection mode *****
// 3   nlink   number of links
// 4   uid     userid of owner *
// 5   gid     groupid of owner *
// 6   rdev    device type, if inode device
// 7   size    size in bytes
// 8   atime   time of last access (Unix timestamp)
// 9   mtime   time of last modification (Unix timestamp)
// 10  ctime   time of last inode change (Unix timestamp)
// 11  blksize blocksize of filesystem IO **
// 12  blocks  number of 512-byte blocks allocated **

function stat(filename) {

  let js_stat = os.stat(filename);
  if (empty(js_stat) == true) {
    return false;
  } else if (js_stat[1] != 0) {
    return false;
  }

  // convert tjs stat to php stat
  const php_stat = {};
  php_stat['dev'] = js_stat[0]['dev'];
  php_stat['ino'] = js_stat[0]['ino'];
  php_stat['mode'] = js_stat[0]['mode'];
  php_stat['nlink'] = js_stat[0]['nlink'];
  php_stat['uid'] = js_stat[0]['uid'];
  php_stat['gid'] = js_stat[0]['gid'];
  php_stat['rdev'] = js_stat[0]['rdev'];
  php_stat['size'] = js_stat[0]['size'];
  php_stat['atime'] = Math.round(js_stat[0].atime / 1000);
  php_stat['mtime'] = Math.round(js_stat[0]['mtime'] / 1000);
  php_stat['ctime'] = Math.round(js_stat[0]['ctime'] / 1000);
  php_stat['blksize'] = js_stat[0]['blksize'];
  php_stat['blocks'] = js_stat[0]['blocks'];
  return php_stat;
}

// @param string filename
// @return int|false

function filemtime(filename) {
  const php_stat = stat(filename);
  if (php_stat === false) { return false; }
  return php_stat.mtime;
}

// @param string pattern
// @param int flags
// @return array|false

function glob(pattern, flags) {

  const files = [];
  const glob_files = os.readdir('.');

  for (let file of glob_files[0]) {
    if (file == '.' || file == '..') {
      continue;
    } else if (fnmatch(pattern, file) == true) {
      files.push(file);
    }
  }

  return files;
}

// Gets the value of a single or all environment variables.
// @param string name
// @return string|false

function getenv(name) {
  // return tjs.getenv(name);
}

// Sets the value of an environment variable.
// @param string assignment
// example: "FOO=BAR"
//
// Notes:
//  - unset env : putenv("FOO");

function putenv(assignment) {
  let items = assignment.split('=', 2);
  if (items.length == 1) {
    return tjs.unsetenv(items[0]);
  }
  return tjs.setenv(items[0], items[1]);
}

// Execute an external program and display raw output.
//
// @param string command
// @return null|false
// Return null on success and false on error.

function passthru(command) {
  let options = {};
  let exit_status = os.exec(command.split(' '));
  if (exit_status == 0) {
    return null;
  }
  return false;
}

// @param string filename
// @return string|false

function file_get_contents(filename) {
  const f = os.open(filename, os.O_RDONLY);
  const file_stat = stat(filename);
  const buffers = new ArrayBuffer(file_stat.size);
  os.read(f, buffers, 0, file_stat.size, 0);
  os.close(f);
  const chars = new Uint8Array(buffers);
  // NOTE: quickjs does not have TextDecoder
  return String.fromCharCode(...chars);
}

// Exit current running program
// @param int code Program exit code.
// @return void
function exit(code) {
  std.exit(code);
}

export {
  array_change_key_case
, array_chunk
, array_combine
, array_count_values
, array_diff
, array_diff_assoc
, array_diff_key
, array_diff_uassoc
, array_diff_ukey
, array_fill
, array_fill_keys
, array_filter
, array_flip
, array_intersect
, array_intersect_assoc
, array_intersect_key
, array_intersect_uassoc
, array_intersect_ukey
, array_key_exists
, array_keys
, array_map
, array_merge
, array_multisort
, array_pad
, array_pop
, array_product
, array_push
, array_rand
, array_reduce
, array_replace
, array_replace_recursive
, array_reverse
, array_search
, array_shift
, array_sum
, array_udiff
, array_udiff_assoc
, array_udiff_uassoc
, array_uintersect
, array_uintersect_uassoc
, array_unique
, array_unshift
, array_values
, array_walk
, array_walk_recursive
, count
, current
, date
, each
, empty
, end
, explode
, filemtime
, file_get_contents
, getenv
, glob
, in_array
, is_file
, is_array
, is_null
, key
, next
, passthru
, prev
, putenv
, range
, reset
, str_replace
, time
, utf8_decode
, utf8_encode
, xdiff_string_diff
, xdiff_string_patch
, exit
};
