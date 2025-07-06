
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

export { assert };

