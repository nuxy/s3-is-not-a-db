'use strict';

const chai = require('chai');

const expect = chai.expect;

// Load modules.
const Utils = require(`${PACKAGE_ROOT}/src/Utils.js`);

describe('Utils module', function() {
  describe('Static methods', function() {
    describe('genRandomStr', function() {
      const result1 = Utils.genRandomStr();
      const result2 = Utils.genRandomStr(16);
      const result3 = Utils.genRandomStr('foo');

      it('should return value', function() {
        expect(result1).to.be.a('string').to.have.lengthOf(32);
        expect(result2).to.be.a('string').to.have.lengthOf(16);
      });

      it('should not return value', function() {
        expect(result3).to.be.undefined;
      });
    });

    describe('pascalCase', function() {
      const result1 = Utils.pascalCase('foo-bar*Biz_baz');
      const result2 = Utils.pascalCase('FOO_BAR_BIZ_BAZ');
      const result3 = Utils.pascalCase('FooBarBiz--baz');
      const result4 = Utils.pascalCase('fooBar+biz$baz');

      it('should return value', function() {
        expect(result1).to.be.an('string');
        expect(result1).to.equal('FooBarBizBaz');

        expect(result2).to.be.an('string');
        expect(result2).to.equal('FooBarBizBaz');

        expect(result3).to.be.an('string');
        expect(result3).to.equal('FooBarBizBaz');

        expect(result4).to.be.an('string');
        expect(result4).to.equal('FooBarBizBaz');
      });
    });
  });
});
