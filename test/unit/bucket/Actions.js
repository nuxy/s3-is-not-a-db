'use strict';

const chai           = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon          = require('sinon');

chai.use(chaiAsPromised);

const expect = chai.expect;

// Load modules.
const Actions = require(`${PACKAGE_ROOT}/src/bucket/Actions`);
const Client  = require(`${PACKAGE_ROOT}/src/Client`);

afterEach(() => {
  sinon.restore();
});


describe('BucketActions', function() {
  const bucket     = 's3-is-not-a-db';
  const region     = 'us-east-1';
  const prefixPath = '/path/to/object';
  const actions    = new Actions(bucket, region);

  actions.prefixPath = prefixPath;

  describe('Getters/Setters', function() {
    describe('prefixPath', function() {
      it('should return value', function() {
        expect(actions.prefixPath).to.be.an('string');
        expect(actions.prefixPath).to.equal(prefixPath);
      });
    });
  });

  describe('Instance methods', function() {
    describe('list', function() {
      it('should resolve Promise', function() {
        sinon.stub(Client.prototype, 'list').resolves('foo');

        const result = actions.list();

        return expect(result).to.eventually.include('foo');
      });
    });

    describe('delete', function() {
      it('should resolve Promise', function() {
        sinon.stub(Client.prototype, 'delete').resolves();

        const result = actions.delete('keyName');

        return expect(result).to.eventually.be.undefined;
      });
    });

    describe('fetch', function() {
      it('should resolve Promise', function() {
        sinon.stub(Client.prototype, 'fetch').resolves('data');

        const result = actions.fetch('keyName');

        return expect(result).to.eventually.be.equal('data');
      });
    });

    describe('write', function() {
      it('should resolve Promise', function() {
        sinon.stub(Client.prototype, 'write').resolves();

        const result = actions.write('keyName', 'plain/text');

        return expect(result).to.eventually.be.undefined;
      });
    });

    describe('rename', function() {
      it('should resolve Promise', function() {
        sinon.stub(Client.prototype, 'rename').resolves();

        const result = actions.rename('keyName1', 'keyName2');

        return expect(result).to.eventually.be.undefined;
      });
    });

    describe('exists', function() {
      it('should resolve Promise', function() {
        sinon.stub(Client.prototype, 'exists').resolves(true);

        const result = actions.exists('keyName');

        return expect(result).to.eventually.be.true;
      });
    });

    describe('isLocked', function() {
      it('should resolve Promise', async function() {
        const callback = sinon.stub(Actions.prototype, 'exists');

        let result;

        callback.onCall(0).resolves(false);

        result = actions.isLocked('keyName');

        expect(result).to.eventually.be.false;

        callback.onCall(1).resolves(true);

        result = actions.isLocked('keyName');

        expect(result).to.eventually.be.true;
      });
    });

    describe('lockObject', function() {
      it('should resolve Promise', function() {
        sinon.stub(Actions.prototype, 'exists').resolves(false);

        const result = actions.lockObject('keyName');

        return expect(result).to.eventually.be.undefined;
      });

      it('should resolve Error', function() {
        sinon.stub(Actions.prototype, 'exists').resolves({});

        const result = actions.lockObject('keyName');

        return expect(result).to.be.rejectedWith(Error, /Lock exists for/);
      });
    });

    describe('unlockObject', function() {
      it('should resolve Promise', function() {
        sinon.stub(Actions.prototype, 'exists').resolves(true);

        const result = actions.unlockObject('keyName');

        return expect(result).to.eventually.be.undefined;
      });
    });
  });
});
