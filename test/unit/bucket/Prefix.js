import {expect} from 'chai';

// Load modules.
const Prefix = (await import(`${PACKAGE_ROOT}/src/bucket/Prefix.js`)).default;
const Model  = (await import(`${PACKAGE_ROOT}/src/bucket/Model.js`)).default;

describe('BucketPrefix', function() {

  // Create Models for testing.
  const modelFoo = new Model('foo');
  const modelBar = new Model('bar');
  const modelBiz = new Model('biz');
  const modelBaz = new Model('baz');

  modelFoo.parent = null;
  modelBar.parent = modelFoo;
  modelBiz.parent = modelBar;
  modelBaz.parent = modelBiz;

  const prefix = new Prefix(modelBaz);

  describe('Instance methods', function() {
    describe('rootParam', function() {
      it('should return value', function() {
        const param = prefix.rootParam();

        expect(param).to.be.an('string');
        expect(param).to.equal('foo');
      });
    });

    describe('lastParam', function() {
      it('should return value', function() {
        const param = prefix.lastParam();

        expect(param).to.be.an('string');
        expect(param).to.equal('baz');
      });
    });

    describe('params', function() {
      it('should return value', function() {
        const params = prefix.params();

        expect(params).to.be.an('array');
        expect(params.length).to.equal(4);
        expect(
          params.every(param => (typeof param === 'string'))
        ).to.be.true;
      });
    });

    describe('getParam', function() {
      it('should return value', function() {
        const param1 = prefix.getParam();
        const param2 = prefix.getParam(2);

        expect(param1).to.be.an('string');
        expect(param1).to.equal('foo');

        expect(param2).to.be.an('string');
        expect(param2).to.equal('bar');
      });
    });

    describe('path', function() {
      it('should return value', function() {
        const path = prefix.path();

        expect(path).to.be.an('string');
        expect(path).to.equal('foo/bar/biz/baz');
      });
    });
  });
});
