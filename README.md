# S3 is NOT a DB

[![Build Status](https://img.shields.io/github/actions/workflow/status/nuxy/s3-is-not-a-db/.github%2Fworkflows%2Fci.yml)](https://app.travis-ci.com/github/nuxy/s3-is-not-a-db) [![Coverage](https://coveralls.io/repos/nuxy/s3-is-not-a-db/badge.svg?branch=master)](https://coveralls.io/r/nuxy/s3-is-not-a-db?branch=master)

Simple interface to using [Amazon S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html) as a database. :warning: Work In Progress :warning:

Want to [use this](#for-the-impatient-to-do) in a **non-production** environment?

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

// Prefix: <Bucket>/foo/00112233-4455-6677-8899-aabbccddeeff
const data = await client.Foo.fetch('00112233-4455-6677-8899-aabbccddeeff');
// {foo1: <Value>, foo2: <Value>, foo3: <Value>}

await client.Foo.write('00112233-4455-6677-8899-aabbccddeeff', {...data, foo1: 'newValue'});
// {foo1: <Value>, foo2: <Value>, foo3: 'newValue'}

  ..

// Prefix: <Bucket>/foo/bar/00112233-4455-6677-8899-aabbccddeeff
const data = await client.FooBar.fetch('00112233-4455-6677-8899-aabbccddeeff');
// {bar1: <Value>, bar2: <Value>, bar3: <Value>}

await client.FooBar.write('00112233-4455-6677-8899-aabbccddeeff', {...data, bar2: 'newValue'});
// {bar1: <Value>, bar2: 'newValue', bar3: <Value>}
```

### Model properties

In most cases you just need to instanciate your model using:

```javascript
const model = new Model('<Name>'); // Maps R/W operations to Prefix: <Bucket>/<Name>
```

In more complex cases you can _extend the model_ with the following **optional** properties:

| Property | Description                                                  |
|----------|--------------------------------------------------------------|
| `name`   | The model name alternative to using `new Model('<Name>')`    |
| `parent` | References the associated Model (nested relationship)        |
| `fields` | Defines supported root-level `Object` keys in R/W operations |
| `type`   | Supported types (`base64`, `binary`, `json` , `text`)        |

#### Image example

```javascript
// Construct the model.
const modelImage = new Model('image');
modelImage.type = 'binary';

  ..

// Read image into TypedArray
const data = Uint8Array.from(
  Buffer.from(
    fs.readFileSync('path/to/example.jpg')
  )
);

await client.Image.write('example.jpg', data);

const buffer = await client.Image.fetch('example.jpg');

// Convert result to Base64 URL
buffer.toString('base64url');
```

## For the impatient (TO DO)

While [`batch`](https://github.com/nuxy/s3-is-not-a-db/blob/master/src/bucket/Actions.js#L274) processing works in a perfect environment a deadlock can occur anytime an exception is thrown in-between client operations.  For example, a network failure may result with an incomplete operation that results with an `<Object>.lock` that prevents write operations for new client instances (e.g. threaded application).

I'm currently evaluating several solutions on how to handle this (the "Work in Progress").  If you **don't care about write integrity in a multi-user or threaded environment** all other [client methods](https://nuxy.github.io/s3-is-not-a-db) work as expected.

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
