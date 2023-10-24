'use strict';

const chai = require('chai');

const expect = chai.expect;

// Load modules.
const Common = require(`${PACKAGE_ROOT}/src/Common.js`);

describe('Common module', function() {
  describe('Static methods', function() {
    describe('pascalCase', function() {
      const result1 = Common.pascalCase('foo-bar*Biz_baz');
      const result2 = Common.pascalCase('FOO_BAR_BIZ_BAZ');
      const result3 = Common.pascalCase('FooBarBiz--baz');
      const result4 = Common.pascalCase('fooBar+biz$baz');

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
