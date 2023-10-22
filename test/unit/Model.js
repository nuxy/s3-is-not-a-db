'use strict';

const chai = require('chai');

const expect = chai.expect;

// Load modules.
const Model = require(`${PACKAGE_ROOT}/src/Model`);

describe('Model', function() {
  describe('Getters/Setters', function() {
    describe('name', function() {
      const modelFoo = new Model('foo');

      it('should return value', function() {
        expect(modelFoo.name).to.be.an('string');
        expect(modelFoo.name).to.equal('foo');
      });
    });

    describe('parent', function() {
      const modelFoo = new Model('foo');
      const modelBar = new Model('bar');

      modelFoo.parent = modelBar;

      it('should return value', function() {
        expect(modelFoo.parent instanceof Model).to.be.true;
        expect(modelFoo.parent).to.equal(modelBar);
      });
    });

    describe('fields', function() {
      const modelFoo = new Model('foo');
      const fields = ['foo', 'bar'];

      modelFoo.fields = fields;

      it('should return value', function() {
        expect(modelFoo.fields).to.be.an('array');
        expect(modelFoo.fields).to.equal(fields);
      });
    });
  });
});
