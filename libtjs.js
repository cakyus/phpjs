import { empty } from './libphp.js';

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

async function stat(filename) {

  let js_stat = {};
  try {
    js_stat = await tjs.stat(filename);
  } catch(e) {
    return false;
  }

  if (empty(js_stat) == true) {
    return false;
  }

  // convert tjs stat to php stat
  const php_stat = {};
  php_stat['dev'] = js_stat['dev'];
  php_stat['ino'] = js_stat['ino'];
  php_stat['mode'] = js_stat['mode'];
  php_stat['nlink'] = js_stat['nlink'];
  php_stat['uid'] = js_stat['uid'];
  php_stat['gid'] = js_stat['gid'];
  php_stat['rdev'] = js_stat['rdev'];
  php_stat['size'] = js_stat['size'];
  php_stat['atime'] = Math.round(js_stat['atim'] / 1000);
  php_stat['mtime'] = Math.round(js_stat['mtim'] / 1000);
  php_stat['ctime'] = Math.round(js_stat['ctim'] / 1000);
  php_stat['blksize'] = js_stat['blksize'];
  php_stat['blocks'] = js_stat['blocks'];
  return php_stat;
}

// @param string filename
// @return int|false

async function filemtime(filename) {
  const result = await stat(filename);
  if (result === false) { return false; }
  return result.mtime;
}

// @param string pattern
// @param int flags
// @return array|false

async function glob(pattern, flags) {

  const files = [];

  const glob_files = await tjs.readDir('.');
  for await (let glob_file of glob_files) {

    if (glob_file == '.' || glob_file == '..') {
      continue;
    }

    const match = glob_file.match(pattern);
    if (Object.is(match, null) == true) {
      continue;
    }

    files.push(glob_file);
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

async function passthru(command) {

  let options = {};
  // tjs.spawn require an array in which the first member is an executable.
  // it it doesnt -> Error: no such file or directory
  let process = await tjs.spawn(command.split(' '));
  let status = await process.wait();
  if (status.exit_status == 0) {
    return null;
  }
  return false;
}

// @param string filename
// @return string|false

async function file_get_contents(filename) {

  if (filename == 'php://stdin') {
    let text = '';
    const decoder = new TextDecoder();
    let chars = new Uint8Array(4096);
    await tjs.stdin.read(chars);
    text = decoder.decode(chars);
    return text;
  }

  const chars = await tjs.readFile(filename);
  const decoder = new TextDecoder();
  return decoder.decode(chars);
}

// Exit current running program
// @param int code Program exit code.
// @return void
function exit(code) {
  tjs.exit(code);
}

export {
exit,
file_get_contents,
filemtime,
getenv,
is_file,
passthru,
putenv
};
