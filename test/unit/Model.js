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

    describe('index', function() {
      const modelFoo = new Model('Foo');
      modelFoo.parent = null;
      modelFoo.fields = ['foo1', 'foo2', 'foo3'];

      const modelBar = new Model('Bar');
      modelBar.parent = modelFoo;
      modelBar.fields = ['bar1', 'bar2', 'bar3'];

      const modelBiz = new Model('Biz');
      modelBiz.parent = modelBar;
      modelBiz.fields = ['biz1', 'biz2', 'biz3'];

      const modelBaz = new Model('Baz');
      modelBaz.parent = modelBiz;
      modelBaz.fields = ['baz1', 'baz2', 'baz3'];

      it('should return value', function() {
        expect(modelFoo.index).to.be.an('number');
        expect(modelFoo.index).to.equal(0);

        expect(modelBar.index).to.be.an('number');
        expect(modelBar.index).to.equal(1);

        expect(modelBiz.index).to.be.an('number');
        expect(modelBiz.index).to.equal(2);

        expect(modelBaz.index).to.be.an('number');
        expect(modelBaz.index).to.equal(3);
      });
    });
  });
});
