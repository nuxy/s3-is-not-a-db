'use strict';

const chai = require('chai');

const expect = chai.expect;

// Load modules.
const {
  throwError
} = require(`${PACKAGE_ROOT}/src/Errors`);

describe('Errors', function() {
  describe('Exported functions', function() {
    it('should throw Error', function() {
      const result1 = () => throwError('INVALID_BUCKET_PREFIX', 'foo');
      const result2 = () => throwError('INVALID_OBJECT_TARGET', 'bar');
      const result3 = () => throwError('MODEL_NAME_EXISTS',     'biz');
      const result4 = () => throwError('OBJECT_LOCK_EXISTS',    'baz');
      const result5 = () => throwError('INVALID_MESSAGE_CODE');
      const result6 = () => throwError('');

      expect(result1).to.throw('Invalid Bucket Prefix: foo');
      expect(result2).to.throw('Invalid Object target: bar');
      expect(result3).to.throw("Cannot redeclare name 'biz' in Model");
      expect(result4).to.throw('Lock exists for: baz');
      expect(result5).to.throw('Invalid message code');
      expect(result6).to.throw('Invalid message code');
    });
  });
});
