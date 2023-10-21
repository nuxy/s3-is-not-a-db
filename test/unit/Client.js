'use strict';

const AWSMock        = require('aws-sdk-mock');
const chai           = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const expect = chai.expect;

// Local modules.
const Client = require(`${PACKAGE_ROOT}/src/Client`);

afterEach(() => {
  AWSMock.restore();
});

describe('Client', function() {
  const bucket = 's3-is-not-a-db';
  const region = 'us-east-1';
  const client = new Client(bucket, region);

  describe('Getters/Setters', function() {
    describe('bucket', function() {
      client.bucket = bucket;

      it('should return value', function() {
        expect(client.bucket).to.be.an('string');
        expect(client.bucket).to.equal(bucket);
      });
    });

    describe('region', function() {
      client.region = region;

      it('should return value', function() {
        expect(client.region).to.be.an('string');
        expect(client.region).to.equal(region);
      });
    });
  });

  describe('Instance methods', function() {
    describe('list', function() {
      it('should resolve Promise', function() {
        AWSMock.mock('S3', 'listObjects', function(params, callback) {
          callback(null, Promise.resolve({Body: {Contents: [{Key: 'foo'}]}}));
        });

        const result = client.list('/path/to/file');

        return expect(result).to.eventually.include('foo');
      });

      it('should resolve Error', function() {
        const result = client.list('');

        return expect(result).to.be.rejectedWith(Error, /Invalid Bucket Prefix/);
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

        const result = client.delete('/path/to/file.ext');

        return expect(result).to.eventually.be.undefined;
      });

      it('should resolve Error', function() {
        const result = client.delete('');

        return expect(result).to.be.rejectedWith(Error, /Invalid Bucket Prefix/);
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

        const result = client.fetch('/path/to/file.ext');

        return expect(result).to.eventually.be.equal('data');
      });

      it('should resolve Error', function() {
        const result = client.fetch('');

        return expect(result).to.be.rejectedWith(Error, /Invalid Bucket Prefix/);
      });
    });

    describe('write', function() {
      it('should resolve Promise', function() {
        AWSMock.mock('S3', 'putObject', function(params, callback) {
          callback(null, Promise.resolve());
        });

        const result = client.write('/path/to/file.ext', '', 'plain/text');

        return expect(result).to.eventually.be.undefined;
      });

      it('should resolve Error', function() {
        const result = client.write('', '', '');

        return expect(result).to.be.rejectedWith(Error, /Invalid Bucket Prefix/);
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

        const result = client.rename('/path/to/file1.ext', '/path/to/file2.ext');

        return expect(result).to.eventually.be.undefined;
      });

      it('should resolve Error', function() {
        const result = client.rename('', '');

        return expect(result).to.be.rejectedWith(Error, /Invalid Bucket Prefix/);
      });
    });

    describe('exists', function() {
      it('should resolve Promise', function() {
        AWSMock.mock('S3', 'headObject', function(params, callback) {
          callback(null, Promise.resolve(true));
        });

        const result = client.exists('/path/to/file.ext');

        return expect(result).to.eventually.be.true;
      });

      it('should resolve Error', function() {
        const result = client.exists('');

        return expect(result).to.be.rejectedWith(Error, /Invalid Bucket Prefix/);
      });
    });
  });
});
