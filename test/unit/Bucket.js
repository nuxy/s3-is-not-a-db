import {expect} from 'chai';

// Load modules.
const Bucket  = (await import(`${PACKAGE_ROOT}/src/Bucket.js`)).default;
const Actions = (await import(`${PACKAGE_ROOT}/src/bucket/Actions.js`)).default;
const Model   = (await import(`${PACKAGE_ROOT}/src/bucket/Model.js`)).default;

describe('Bucket', function() {
  describe('Instance methods', function() {

    // Create Models for testing.
    const modelFoo = new Model('Foo');
    const modelBar = new Model('Bar');
    const modelBiz = new Model('Biz');
    const modelBaz = new Model('Baz');

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

    describe('config (errors)', function() {
      it('should throw Error', function() {
        const modelFake = 'foo';

        class Storage extends Bucket {
          models = [modelFake];
        }

        const storage = new Storage();

        const result = () => {
          storage.config({
            bucket: 's3-is-not-a-db',
            region: 'us-east-1'
          });
        };

        expect(result).to.throw('Invalid Model object: string');
      });
    });
  });
});
