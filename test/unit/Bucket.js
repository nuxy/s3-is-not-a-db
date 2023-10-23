'use strict';

const chai = require('chai');

const expect = chai.expect;

// Load modules.
const Actions = require(`${PACKAGE_ROOT}/src/bucket/Actions`);
const Bucket  = require(`${PACKAGE_ROOT}/src/Bucket`);
const Model   = require(`${PACKAGE_ROOT}/src/Model`);

describe('Bucket', function() {

  // Create Models for testing.
  const modelFoo = new Model('Foo');
  const modelBar = new Model('Bar');
  const modelBiz = new Model('Biz');
  const modelBaz = new Model('Baz');

  describe('Instance methods', function() {
    describe('config', function() {
      class Storage extends Bucket {
        models = [modelFoo, modelBar, modelBiz, modelBaz];
      }

      const storage = new Storage();

      const client = storage.config({
        bucket: 's3-is-not-a-db',
        region: 'us-east-1'
      });

      it('should return true', function() {
        expect(client.Foo instanceof Actions).to.be.true;
        expect(client.Bar instanceof Actions).to.be.true;
        expect(client.Biz instanceof Actions).to.be.true;
        expect(client.Baz instanceof Actions).to.be.true;
      });

      it('should return false', function() {
        expect(client.foo instanceof Actions).to.be.false;
        expect(client.bar instanceof Actions).to.be.false;
        expect(client.biz instanceof Actions).to.be.false;
        expect(client.baz instanceof Actions).to.be.false;
      });
    });
  });
});
