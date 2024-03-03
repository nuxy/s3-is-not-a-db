import {expect} from 'chai';

// Load modules.
const Utils = await import(`${PACKAGE_ROOT}/src/Utils.js`);

describe('Utils module', function() {
  describe('Static methods', function() {
    describe('compareArrays', function() {
      const result1 = Utils.compareArrays();
      const result2 = Utils.compareArrays(['foo','bar','biz'], ['foo','bar','biz']);
      const result3 = Utils.compareArrays(['bar','biz','foo'], ['foo','bar','biz']);

      it('should return value', function() {
        expect(result1).to.be.false;
        expect(result2).to.be.true;
        expect(result3).to.be.true;
      });
    });

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

    describe('isObject', function() {
      const result1 = Utils.isObject();
      const result2 = Utils.isObject('foo');
      const result3 = Utils.isObject(['foo']);
      const result4 = Utils.isObject({foo: 'bar'});

      it('should return value', function() {
        expect(result1).to.be.false;
        expect(result2).to.be.false;
        expect(result3).to.be.false;
        expect(result4).to.be.true;
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
