import { glob } from './libqjs.js';
import { assert } from './libtest.js';
import { is_array } from './libphp.js';

test_glob();

function test_glob() {
  assert(true, is_array(glob('lib*.js')));
}
