import {expect} from 'chai';

// Load modules.
const {throwError} = await import(`${PACKAGE_ROOT}/src/Errors.js`);

describe('Errors', function() {
  describe('Exported functions', function() {
    it('should throw Error', function() {
      const result1 = () => throwError('INVALID_BUCKET_PREFIX', 'foo');
      const result2 = () => throwError('INVALID_MODEL_FIELDS',  'foo <> bar', 'biz');
      const result3 = () => throwError('INVALID_MODEL_OBJECT',  'bar');
      const result4 = () => throwError('INVALID_OBJECT_TARGET', 'biz');
      const result5 = () => throwError('MODEL_NAME_EXISTS',     'baz');
      const result6 = () => throwError('OBJECT_LOCK_EXISTS',    'boz');
      const result7 = () => throwError('INVALID_MESSAGE_CODE');
      const result8 = () => throwError('');

      expect(result1).to.throw('Invalid Bucket Prefix: foo');
      expect(result2).to.throw("Invalid Model fields 'foo <> bar' in 'biz'");
      expect(result3).to.throw('Invalid Model object: bar');
      expect(result4).to.throw('Invalid Object target: biz');
      expect(result5).to.throw("Cannot redeclare name 'baz' in Model");
      expect(result6).to.throw('Lock exists for: boz');
      expect(result7).to.throw('Invalid message code');
      expect(result8).to.throw('Invalid message code');
    });
  });
});
