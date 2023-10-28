'use strict';

const chai = require('chai');

const expect = chai.expect;

// Load modules.
const Model = require(`${PACKAGE_ROOT}/src/Model`);

describe('Model', function() {
  describe('Getters/Setters', function() {
    describe('name', function() {
      it('should return value', function() {
        const modelFoo = new Model('foo');

        expect(modelFoo.name).to.be.an('string');
        expect(modelFoo.name).to.equal('foo');
      });

      it('should be null', function() {
        const modelFoo = new Model('');

        expect(modelFoo.parent).to.be.null;
      });
    });

    describe('parent', function() {
      const modelFoo = new Model('foo');
      const modelBar = new Model('bar');

      it('should return value', function() {
        modelFoo.parent = modelBar;

        expect(modelFoo.parent instanceof Model).to.be.true;
        expect(modelFoo.parent).to.equal(modelBar);
      });

      it('should be null', function() {
        modelBar.parent = 'modelFake';

        expect(modelBar.parent).to.be.null;
      });
    });

    describe('fields', function() {
      it('should return value', function() {
        const modelFoo = new Model('foo');
        const fields = ['foo', 'bar'];

        modelFoo.fields = fields;

        expect(modelFoo.fields).to.be.an('array');
        expect(modelFoo.fields).to.equal(fields);
      });

      it('should be null', function() {
        const modelFoo = new Model('foo');
        modelFoo.fields = ['foo', {}];

        expect(modelFoo.fields).to.be.null;
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

  describe('Static methods', function() {
    describe('isValidName', function() {
      it('should return value', function() {
        const result1 = Model.isValidName('foo');
        const result2 = Model.isValidName('b%&-r');

        expect(result1).to.be.an('boolean');
        expect(result1).to.be.true;

        expect(result2).to.be.an('boolean');
        expect(result2).to.be.false;
      });
    });

    describe('isValidParent', function() {
      it('should return value', function() {
        const modelFoo = new Model('foo');

        const result1 = Model.isValidParent(modelFoo);
        const result2 = Model.isValidParent('foo');

        expect(result1).to.be.an('boolean');
        expect(result1).to.be.true;

        expect(result2).to.be.an('boolean');
        expect(result2).to.be.false;
      });
    });

    describe('isValidFields', function() {
      it('should return value', function() {
        const result1 = Model.isValidFields(['foo', 'bar', 'biz', 'baz']);
        const result2 = Model.isValidFields(['foo', {}, 'biz', 'baz']);
        const result3 = Model.isValidFields('foo');

        expect(result1).to.be.an('boolean');
        expect(result1).to.be.true;

        expect(result2).to.be.an('boolean');
        expect(result2).to.be.false;

        expect(result3).to.be.an('boolean');
        expect(result3).to.be.false;
      });
    });
  });
});
