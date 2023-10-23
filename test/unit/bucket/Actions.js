'use strict';

const AWSMock        = require('aws-sdk-mock');
const chai           = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const expect = chai.expect;

// Load modules.
const Actions = require(`${PACKAGE_ROOT}/src/bucket/Actions`);
const Client  = require(`${PACKAGE_ROOT}/src/Client`);

afterEach(() => {
  AWSMock.restore();
});

describe('BucketActions', function() {
  const bucket     = 's3-is-not-a-db';
  const region     = 'us-east-1';
  const prefixPath = '/path/to/file/';
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
        AWSMock.mock('S3', 'listObjects', function(params, callback) {
          callback(null, Promise.resolve({Body: {Contents: [{Key: 'foo'}]}}));
        });

        const result = actions.list();

        return expect(result).to.eventually.include('foo');
      });
    });

    describe('delete', function() {
      it('should resolve Promise', function() {
        AWSMock.mock('S3', 'deleteObject', function(params, callback) {
          callback(null, Promise.resolve());
        });

        AWSMock.mock('S3', 'headObject', function(params, callback) {
          callback(null, Promise.resolve(true));
        });

        const result = actions.delete('file.ext');

        return expect(result).to.eventually.be.undefined;
      });
    });

    describe('fetch', function() {
      it('should resolve Promise', function() {
        AWSMock.mock('S3', 'getObject', function(params, callback) {
          callback(null, Promise.resolve({Body: 'data'}));
        });

        AWSMock.mock('S3', 'headObject', function(params, callback) {
          callback(null, Promise.resolve(true));
        });

        const result = actions.fetch('file.ext');

        return expect(result).to.eventually.be.equal('data');
      });
    });

    describe('write', function() {
      it('should resolve Promise', function() {
        AWSMock.mock('S3', 'putObject', function(params, callback) {
          callback(null, Promise.resolve());
        });

        const result = actions.write('file.ext', 'plain/text');

        return expect(result).to.eventually.be.undefined;
      });
    });

    describe('rename', function() {
      it('should resolve Promise', function() {
        AWSMock.mock('S3', 'deleteObject', function(params, callback) {
          callback(null, Promise.resolve());
        });

        AWSMock.mock('S3', 'getObject', function(params, callback) {
          callback(null, Promise.resolve({Body: 'data'}));
        });

        AWSMock.mock('S3', 'headObject', function(params, callback) {
          switch (true) {
            case /file1.ext/.test(params.Key):
              callback(null, Promise.resolve(true));
              break;

            case /file2.ext/.test(params.Key):
              callback(null, Promise.resolve(false));
              break;
          }
        });

        AWSMock.mock('S3', 'putObject', function(params, callback) {
          callback(null, Promise.resolve());
        });

        const result = actions.rename('file1.ext', 'file2.ext');

        return expect(result).to.eventually.be.undefined;
      });
    });

    describe('exists', function() {
      it('should resolve Promise', function() {
        AWSMock.mock('S3', 'headObject', function(params, callback) {
          callback(null, Promise.resolve(true));
        });

        const result = actions.exists('file.ext');

        return expect(result).to.eventually.be.true;
      });
    });
  });
});
