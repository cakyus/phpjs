
function assert(expect, result, message) {

  let expect_type = typeof(expect);
  let result_type = typeof(result);

  if (expect_type != result_type) {
    throw Error('Expect type. '+expect_type+' <-> '+result_type);
  } else if (expect_type == 'boolean') {
    if (expect == result) {
      // do nothing
    } else if (expect == true) {
      throw Error('Expect true.');
    } else {
      throw Error('Expect false.');
    }
  } else if (expect_type == 'string') {
    if (expect !== result) {
      throw Error('Expect string. '+expect+' '+result);
    }
  } else if (expect_type == 'number') {
    if (expect !== result) {
      throw Error('Expect number. '+expect+' '+result);
    }
  } else if (expect_type == 'object') {
    if (Array.isArray(expect) == true) {
      if (Array.isArray(result) == false) {
        throw Error('Expect an array.');
      } else if (expect.length != result.length) {
        throw Error('Expect array length.');
      }
      // the order of values does not matter
      for (let value of expect) {
        if (result.includes(value) == false) {
          throw Error('Expect array value. '+value);
        }
      }
    }
  } else {
    throw Error('Unknown type. ' + expect_type);
  }
}

export { assert };

