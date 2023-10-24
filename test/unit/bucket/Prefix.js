'use strict';

const chai = require('chai');

const expect = chai.expect;

// Load modules.
const Prefix = require(`${PACKAGE_ROOT}/src/bucket/Prefix`);
const Model  = require(`${PACKAGE_ROOT}/src/Model`);

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
        const param = prefix.getParam(2);

        expect(param).to.be.an('string');
        expect(param).to.equal('bar');
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
