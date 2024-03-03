import {use, expect}   from 'chai';
import chaiAsPromised  from 'chai-as-promised';
import {restore, stub} from 'sinon';

use(chaiAsPromised);

// Load modules.
const Actions = (await import(`${PACKAGE_ROOT}/src/bucket/Actions.js`)).default;
const Client  = (await import(`${PACKAGE_ROOT}/src/Client.js`)).default;

afterEach(() => {
  restore();
});

describe('BucketActions', function() {
  const bucket     = 's3-is-not-a-db';
  const region     = 'us-east-1';
  const name       = 'BucketActions';
  const dataFields = ['foo1', 'foo2', 'foo3'];
  const prefixPath = '/path/to/object';
  const outputType = 'text';
  const actions    = new Actions(bucket, region);

  actions.name       = name;
  actions.dataFields = dataFields;
  actions.outputType = outputType;
  actions.prefixPath = prefixPath;

  describe('Getters/Setters', function() {
    describe('name', function() {
      it('should return value', function() {
        expect(actions.name).to.be.an('string');
        expect(actions.name).to.equal(name);
      });
    });

    describe('dataFields', function() {
      it('should return value', function() {
        expect(actions.dataFields).to.be.an('array');
        expect(actions.dataFields).to.equal(dataFields);
      });
    });

    describe('outputType', function() {
      it('should return value', function() {
        expect(actions.outputType).to.be.an('string');
        expect(actions.outputType).to.equal(outputType);
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
        stub(Client.prototype, 'list').resolves('foo');

        const result = actions.list();

        return expect(result).to.eventually.include('foo');
      });
    });

    describe('delete', function() {
      it('should resolve Promise', function() {
        stub(Client.prototype, 'delete').resolves();

        const result = actions.delete('keyName');

        return expect(result).to.eventually.be.undefined;
      });

      it('should resolve Error', function() {
        actions.lockObject('keyName');

        stub(Actions.prototype, 'isLocked').resolves(true);

        const result = actions.delete('keyName');

        return expect(result).to.be.rejectedWith(Error, /Lock exists for/);
      });
    });

    describe('fetch', function() {
      it('should resolve Promise (base64)', function() {
        actions.outputType = 'base64';

        const output = Buffer.from('foo').toString('base64');

        stub(Client.prototype, 'fetch').resolves({
          transformToString: () => output
        });

        const result = actions.fetch('keyName');

        return expect(result).to.eventually.be.equal(output);
      });

      it('should resolve Promise (blob)', function() {
        actions.outputType = 'blob';

        const output = Buffer.from('foo');

        stub(Client.prototype, 'fetch').resolves({
          transformToByteArray: () => output
        });

        const result = actions.fetch('keyName');

        return expect(result).to.eventually.be.equal(output);
      });

      it('should resolve Promise (json)', function() {
        actions.outputType = 'json';

        const output = '{"foo":"bar"}';

        stub(Client.prototype, 'fetch').resolves({
          transformToString: () => output
        });

        const result = actions.fetch('keyName');

        return expect(result).to.eventually.be.deep.equal({foo: 'bar'});
      });

      it('should resolve Promise (text)', function() {
        actions.outputType = 'text';

        const output = 'foo';

        stub(Client.prototype, 'fetch').resolves({
          transformToString: () => output
        });

        const result = actions.fetch('keyName');

        return expect(result).to.eventually.be.equal(output);
      });

      it('should resolve Promise (undefined)', function() {
        stub(Client.prototype, 'fetch').resolves();

        const result = actions.fetch('keyName');

        return expect(result).to.eventually.be.undefined;
      });

      it('should resolve Error', function() {
        actions.lockObject('keyName');

        stub(Actions.prototype, 'isLocked').resolves(true);

        const result = actions.fetch('keyName');

        return expect(result).to.be.rejectedWith(Error, /Lock exists for/);
      });
    });

    describe('write', function() {
      it('should resolve Promise', function() {
        stub(Client.prototype, 'write').resolves();

        const result1 = actions.write('keyName', 'foo');
        const result2 = actions.write('keyName', {foo1: 'bar1', foo2: 'bar2', foo3: 'bar3'});
        const result3 = actions.write('keyName', Buffer.from(''), 'image/jpeg; charset=utf-8');

        expect(result1).to.eventually.be.undefined;
        expect(result2).to.eventually.be.undefined;
        expect(result3).to.eventually.be.undefined;
      });

      it('should resolve Error (locked)', function() {
        actions.lockObject('keyName');

        stub(Actions.prototype, 'isLocked').resolves(true);

        const result = actions.write('keyName', 'foo');

        return expect(result).to.be.rejectedWith(Error, /Lock exists for/);
      });

      it('should resolve Error (invalid)', function() {
        const result = actions.write('keyName', {foo: 'bar', biz: 'baz'});

        return expect(result).to.be.rejectedWith(Error, /Invalid Model fields/);
      });
    });

    describe('rename', function() {
      it('should resolve Promise', function() {
        stub(Client.prototype, 'rename').resolves();

        const result = actions.rename('keyName1', 'keyName2');

        return expect(result).to.eventually.be.undefined;
      });

      it('should resolve Error', function() {
        actions.lockObject('keyName');

        stub(Actions.prototype, 'isLocked').resolves(true);

        const result = actions.rename('keyName1', 'keyName2');

        return expect(result).to.be.rejectedWith(Error, /Lock exists for/);
      });
    });

    describe('exists', function() {
      it('should resolve Promise', function() {
        stub(Client.prototype, 'exists').resolves(true);

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

        stub(Client.prototype, 'fetch')
          .onCall(0).resolves({transformToString: () => json1})
          .onCall(1).resolves({transformToString: () => json2});

        stub(Client.prototype, 'write').resolves();

        actions.outputType = 'json';

        await actions.batch(keyName, operations);

        const result = actions.fetch(keyName);

        return expect(result).to.eventually.deep.equal(JSON.parse(json2));
      });

      it('should resolve Error (methods)', async function() {
        stub(actions, 'isLocked').resolves(true);

        const keyName = 'file.json';

        const result1 = async() => await actions.delete(keyName);
        const result2 = async() => await actions.fetch(keyName);
        const result3 = async() => await actions.write(keyName);
        const result4 = async() => await actions.rename(keyName, 'bar');
      });

      it('should resolve Error (operations)', function() {
        const json = '{"foo":"bar"}';

        stub(Client.prototype, 'fetch')
          .onCall(0).resolves(json);

        stub(Client.prototype, 'write').rejects();

        const result = actions.batch(keyName, operations);

        return expect(result).to.be.rejectedWith(Error);
      });

      it('should resolve Error (locked)', function() {
        stub(actions, 'isLocked').resolves(true);

        const result = actions.batch(keyName, operations);

        return expect(result).to.be.rejectedWith(Error, /Lock exists for/);
      });
    });

    describe('isLocked', function() {
      it('should resolve Promise', function() {
        stub(Actions.prototype, 'exists')
          .onCall(0).resolves(false)
          .onCall(1).resolves({})
          .onCall(2).resolves({Metadata:{ownerId: 'abcdef123456'}});

        const result1 = actions.isLocked('keyName');

        expect(result1).to.eventually.be.false;

        const result2 = actions.isLocked('keyName');

        expect(result2).to.eventually.be.true;

        const result3 = actions.isLocked('keyName');

        expect(result3).to.eventually.be.false;
      });
    });

    describe('lockObject', function() {
      it('should resolve Promise', function() {
        stub(Actions.prototype, 'exists').resolves(false);

        const result = actions.lockObject('keyName');

        return expect(result).to.eventually.be.undefined;
      });

      it('should resolve Error', function() {
        stub(Actions.prototype, 'exists').resolves(true);

        const result = actions.lockObject('keyName');

        return expect(result).to.be.rejectedWith(Error, /Lock exists for/);
      });
    });

    describe('unlockObject', function() {
      it('should resolve Promise', function() {
        stub(Actions.prototype, 'exists').resolves(true);

        const result = actions.unlockObject('keyName');

        return expect(result).to.eventually.be.undefined;
      });
    });
  });
});
