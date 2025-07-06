import { assert } from './libtest.js';
import {
  is_array,
  glob
} from './libphpqjs.js';

test_glob();

function test_glob() {
  assert(true, is_array(glob('lib*.js')));
}
