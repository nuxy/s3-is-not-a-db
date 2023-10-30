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
  const dataFields = ['foo1', 'foo2', 'foo3'];
  const prefixPath = '/path/to/object';
  const actions    = new Actions(bucket, region);

  actions.dataFields = dataFields;
  actions.prefixPath = prefixPath;

  describe('Getters/Setters', function() {
    describe('dataFields', function() {
      it('should return value', function() {
        expect(actions.dataFields).to.be.an('array');
        expect(actions.dataFields).to.equal(dataFields);
      });
    });

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

      it('should resolve Error', async function() {
        actions.lockObject('keyName');

        sinon.stub(Actions.prototype, 'isLocked').resolves(true);

        const result = actions.delete('keyName');

        return expect(result).to.be.rejectedWith(Error, /Lock exists for/);
      });
    });

    describe('fetch', async function() {
      it('should resolve Promise', function() {
        sinon.stub(Client.prototype, 'fetch').resolves({
          transformToString: () => '{"foo":"bar"}'
        });

        const result = actions.fetch('keyName');

        return expect(result).to.eventually.be.deep.equal({foo: 'bar'});
      });

      it('should resolve Error', async function() {
        actions.lockObject('keyName');

        sinon.stub(Actions.prototype, 'isLocked').resolves(true);

        const result = actions.fetch('keyName');

        return expect(result).to.be.rejectedWith(Error, /Lock exists for/);
      });
    });

    describe('write', function() {
      it('should resolve Promise', async function() {
        sinon.stub(Client.prototype, 'write').resolves();

        const result1 = actions.write('keyName', 'foo');
        const result2 = actions.write('keyName', {foo1: 'bar1', foo2: 'bar2', foo3: 'bar3'});
        const result3 = actions.write('keyName', Buffer.from(''), 'image/jpeg; charset=utf-8');

        await expect(result1).to.eventually.be.undefined;
        await expect(result2).to.eventually.be.undefined;
        await expect(result3).to.eventually.be.undefined;
      });

      it('should resolve Error (locked)', async function() {
        actions.lockObject('keyName');

        sinon.stub(Actions.prototype, 'isLocked').resolves(true);

        const result = actions.write('keyName', 'foo');

        return expect(result).to.be.rejectedWith(Error, /Lock exists for/);
      });

      it('should resolve Error (invalid)', async function() {
        const result = actions.write('keyName', {foo: 'bar', biz: 'baz'});

        return expect(result).to.be.rejectedWith(Error, /Invalid Model data/);
      });
    });

    describe('rename', function() {
      it('should resolve Promise', function() {
        sinon.stub(Client.prototype, 'rename').resolves();

        const result = actions.rename('keyName1', 'keyName2');

        return expect(result).to.eventually.be.undefined;
      });

      it('should resolve Error', async function() {
        actions.lockObject('keyName');

        sinon.stub(Actions.prototype, 'isLocked').resolves(true);

        const result = actions.rename('keyName1', 'keyName2');

        return expect(result).to.be.rejectedWith(Error, /Lock exists for/);
      });
    });

    describe('exists', function() {
      it('should resolve Promise', function() {
        sinon.stub(Client.prototype, 'exists').resolves(true);

        const result = actions.exists('keyName');

        return expect(result).to.eventually.be.true;
      });
    });

    describe('batch', function() {
      const keyName = 'file.json';
      const operations = [];

      // Fetch the object.
      operations.push(() => {
        return actions.fetch(keyName);
      });

      // Update existing data.
      operations.push(data => {
        return actions.write(keyName, {...data, foo1: 'baz'});
      });

      it('should resolve Promise', async function() {
        const json1 = '{"foo1":"bar1","foo2":"bar2","foo3":"bar3"}';
        const json2 = '{"foo1":"bar1","foo2":"bar2","foo3":"bar3"}';

        const callback = sinon.stub(Client.prototype, 'fetch');
        callback.onCall(0).resolves({
          transformToString: () => json1
        });
        callback.onCall(1).resolves({
          transformToString: () => json2
        });

        sinon.stub(Client.prototype, 'write').resolves();

        await actions.batch(keyName, operations);

        const result = actions.fetch(keyName);

        return expect(result).to.eventually.deep.equal(JSON.parse(json2));
      });

      it('should resolve Error (methods)', async function() {
        sinon.stub(actions, 'isLocked').resolves(true);

        const keyName = 'file.json';

        const result1 = async() => await actions.delete(keyName);
        const result2 = async() => await actions.fetch(keyName);
        const result3 = async() => await actions.write(keyName);
        const result4 = async() => await actions.rename(keyName, 'bar');
      });

      it('should resolve Error (operations)', function() {
        const json = '{"foo":"bar"}';

        const callback = sinon.stub(Client.prototype, 'fetch');
        callback.onCall(0).resolves(json);

        sinon.stub(Client.prototype, 'write').rejects();

        const result = actions.batch(keyName, operations);

        return expect(result).to.be.rejectedWith(Error);
      });

      it('should resolve Error (locked)', function() {
        sinon.stub(actions, 'isLocked').resolves(true);

        const result = actions.batch(keyName, operations);

        return expect(result).to.be.rejectedWith(Error, /Lock exists for/);
      });
    });

    describe('isLocked', function() {
      it('should resolve Promise', async function() {
        const callback = sinon.stub(Actions.prototype, 'exists');

        callback.onCall(0).resolves(false);

        const result1 = actions.isLocked('keyName');

        expect(result1).to.eventually.be.false;

        callback.onCall(1).resolves({});

        const result2 = actions.isLocked('keyName');

        expect(result2).to.eventually.be.true;

        callback.onCall(2).resolves({Metadata:{ownerId: 'abcdef123456'}});

        const result3 = actions.isLocked('keyName');

        expect(result3).to.eventually.be.false;
      });
    });

    describe('lockObject', function() {
      it('should resolve Promise', function() {
        sinon.stub(Actions.prototype, 'exists').resolves(false);

        const result = actions.lockObject('keyName');

        return expect(result).to.eventually.be.undefined;
      });

      it('should resolve Error', function() {
        sinon.stub(Actions.prototype, 'exists').resolves(true);

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
