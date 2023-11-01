# S3 is NOT a DB

[![Build Status](https://api.travis-ci.com/nuxy/s3-is-not-a-db.svg?branch=master)](https://app.travis-ci.com/github/nuxy/s3-is-not-a-db) [![Coverage](https://coveralls.io/repos/nuxy/s3-is-not-a-db/badge.svg?branch=master)](https://coveralls.io/r/nuxy/s3-is-not-a-db?branch=master)

Simple interface to using [Amazon S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html) as a database. :warning: Work In Progress :warning:

## Usage

```javascript
// Model: Foo (Prefix root)
const modelFoo = new Model('foo');
modelFoo.parent = null;
modelFoo.fields = ['foo1', 'foo2', 'foo3'];

// Model: FooBar (relationship)
const modelBar = new Model('bar');
modelBar.parent = modelFoo;
modelBar.fields = ['bar1', 'bar2', 'bar3'];

class Storage extends Bucket {
  models = [modelFoo, modelBar];
}

  ..

const storage = new Storage();
const client = storage.config({
  bucket: 's3-is-not-a-db',
  region: 'us-east-1'
});

// Prefix: <Bucket>/foo/<Object>
const data = client.Foo.fetch('00112233-4455-6677-8899-aabbccddeeff');
client.Foo.write('00112233-4455-6677-8899-aabbccddeeff', {...data, foo1: 'newValue'});

// Prefix: <Bucket>/foo/bar/<Object>
const data = client.FooBar.fetch('00112233-4455-6677-8899-aabbccddeeff');
client.FooBar.write('00112233-4455-6677-8899-aabbccddeeff', {...data, bar2: 'newValue'});
```

## Developers

### CLI options

Run [ESLint](https://eslint.org/) on project sources:

    $ npm run lint

Run [Mocha](https://mochajs.org) unit tests:

    $ npm run test

Run the [example](https://github.com/nuxy/s3-is-not-a-db/tree/master/example) as a single process:

    $ npm run example-single

Run the [example](https://github.com/nuxy/s3-is-not-a-db/tree/master/example) concurrently:

    $ npm run example-parallel

## References

- [Amazon Simple Storage Service quotas](https://docs.aws.amazon.com/general/latest/gr/s3.html#limits_s3)
- [Organizing objects using prefixes](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-prefixes.html)
- [Record locking (Pessimistic control)](https://en.wikipedia.org/wiki/Record_locking)

## Versioning

This package is maintained under the [Semantic Versioning](https://semver.org) guidelines.

## License and Warranty

This package is distributed in the hope that it will be useful, but without any warranty; without even the implied warranty of merchantability or fitness for a particular purpose.

_s3-is-not-a-db_ is provided under the terms of the [MIT license](http://www.opensource.org/licenses/mit-license.php)

[Amazon S3](https://aws.amazon.com/s3) is a registered trademark of Amazon Web Services, Inc.

## Author

[Marc S. Brooks](https://github.com/nuxy)
