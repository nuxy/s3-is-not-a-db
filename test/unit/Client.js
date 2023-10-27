'use strict';

const {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client
} = require('@aws-sdk/client-s3');

const {mockClient} = require('aws-sdk-client-mock');

const s3Client = mockClient(S3Client);

const chai           = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const expect = chai.expect;

// Load modules.
const Client = require(`${PACKAGE_ROOT}/src/Client`);

afterEach(() => {
  s3Client.reset();
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
        s3Client.on(ListObjectsV2Command).resolves({Contents: [{Key: 'foo'}]});

        const result = client.list('/path/to/objects');

        return expect(result).to.eventually.include('foo');
      });

      it('should resolve Error', function() {
        const result = client.list('');

        return expect(result).to.be.rejectedWith(Error, /Invalid Bucket Prefix/);
      });
    });

    describe('delete', function() {
      it('should resolve Promise', function() {
        s3Client.on(DeleteObjectCommand).resolves();

        const result = client.delete('/path/to/keyName');

        return expect(result).to.eventually.be.undefined;
      });

      it('should resolve Error', function() {
        const result = client.delete('');

        return expect(result).to.be.rejectedWith(Error, /Invalid Bucket Prefix/);
      });
    });

    describe('fetch', function() {
      it('should resolve Promise', function() {
        s3Client.on(GetObjectCommand).resolves({Body: 'data'});

        const result = client.fetch('/path/to/keyName');

        return expect(result).to.eventually.be.equal('data');
      });

      it('should resolve Error', function() {
        const result = client.fetch('');

        return expect(result).to.be.rejectedWith(Error, /Invalid Bucket Prefix/);
      });
    });

    describe('write', function() {
      it('should resolve Promise', function() {
        s3Client.on(PutObjectCommand).resolves();

        const json = '{"foo":"bar"}';

        const result = client.write('/path/to/keyName', json, {contentType: 'application/json'});

        return expect(result).to.eventually.be.undefined;
      });

      it('should resolve Error', function() {
        const result = client.write('', '', '');

        return expect(result).to.be.rejectedWith(Error, /Invalid Bucket Prefix/);
      });
    });

    describe('rename', function() {
      it('should resolve Promise', function() {
        s3Client.on(DeleteObjectCommand).resolves(true);

        s3Client.on(GetObjectCommand).resolves({Body: 'data'});

        s3Client.on(HeadObjectCommand, {Key: '/path/to/keyName1'}).resolves(true);
        s3Client.on(HeadObjectCommand, {Key: '/path/to/keyName2'}).resolves(false);

        s3Client.on(PutObjectCommand).resolves();

        const result = client.rename('/path/to/keyName1', '/path/to/keyName2');

        return expect(result).to.eventually.be.undefined;
      });

      it('should resolve Error', function() {
        const result = client.rename('', '');

        return expect(result).to.be.rejectedWith(Error, /Invalid Bucket Prefix/);
      });
    });

    describe('exists', async function() {
      it('should resolve Promise (data)', async function() {
        s3Client.on(HeadObjectCommand).resolves({
          ETag: '686897696a7c876b7e',
          LastModified: 'Thu, 25 Oct 2023 00:00:00 GMT',
          Metadata: {}
        });

        const result = client.exists('/path/to/keyName');

        await expect(result).to.eventually.have.property('ETag');
        await expect(result).to.eventually.have.property('LastModified');
        await expect(result).to.eventually.have.property('Metadata');
      });

      it('should resolve Promise (false)', function() {
        s3Client.on(HeadObjectCommand).rejects({name: 'NotFound'});

        const result = client.exists('/path/to/keyName');

        return expect(result).to.eventually.be.false;
      });

      it('should resolve Error', function() {
        const result = client.exists('');

        return expect(result).to.be.rejectedWith(Error, /Invalid Bucket Prefix/);
      });
    });
  });
});
