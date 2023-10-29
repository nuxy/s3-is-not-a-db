'use strict';

const {v1: uuid} = require('uuid');

// Local modules.
const Storage = require('./Storage');

// Initialize client.
const storage = new Storage();

const client = storage.config({
  bucket: 's3-is-not-a-db',
  region: 'us-east-1'
});

// Query S3 storage.
(async function() {
  let keyName;

  // .. prefix foo
  try {
    let data;

    keyName = uuid();

    console.log("Test model 'Foo' with prefix 'foo'");

    await client.Foo.write(keyName, {
      foo1: 'value1', foo2: 'value2', foo3: 'value3'
    });

    console.log(`Created: ${keyName}`);

    data = await client.Foo.fetch(keyName);

    console.log(`Found: ${await data.transformToString()}`);

    await client.Foo.delete(keyName);

    console.log(`Removed: ${keyName}`);

    if (!await client.Foo.fetch(keyName)) {
      console.log('Complete\n');
    }

  } catch (err) {
    console.info(`${err}\n`);
  }

  // .. prefix foo/bar
  try {
    let data;

    keyName = uuid();

    console.log("Test model 'FooBar' with prefix 'foo/bar'");

    await client.FooBar.write(keyName, {
      bar1: 'value1', bar2: 'value2', bar3: 'value3'
    });

    console.log(`Created: ${keyName}`);

    data = await client.FooBar.fetch(keyName);

    console.log(`Found: ${await data.transformToString()}`);

    await client.Bar.delete(keyName);

    console.log(`Removed: ${keyName}`);

    if (!await client.FooBar.fetch(keyName)) {
      console.log('Complete\n');
    }

  } catch (err) {
    console.info(`${err.message}\n`);
  }

  // .. prefix foo/bar/biz
  try {
    let data;

    keyName = uuid();

    console.log("Test model 'FooBarBiz' with prefix 'foo/bar/biz'");

    await client.FooBarBiz.write(keyName, {
      biz1: 'value1', biz2: 'value2', biz3: 'value3'
    });

    console.log(`Created: ${keyName}`);

    data = await client.FooBarBiz.fetch(keyName);

    console.log(`Found: ${await data.transformToString()}`);

    await client.FooBarBiz.delete(keyName);

    console.log(`Removed: ${keyName}`);

    if (!await client.FooBarBiz.fetch(keyName)) {
      console.log('Complete\n');
    }

  } catch (err) {
    console.info(`${err.message}\n`);
  }

  // .. prefix foo/bar/baz
  try {
    let data;

    keyName = uuid();

    console.log("Test model 'FooBarBizBaz' with prefix 'foo/bar/biz/baz'");

    await client.FooBarBizBaz.write(keyName, {
      baz1: 'value1', baz2: 'value2', baz3: 'value3'
    });

    console.log(`Created: ${keyName}`);

    data = await client.FooBarBizBaz.fetch(keyName);

    console.log(`Found: ${await data.transformToString()}`);

    await client.FooBarBizBaz.delete(keyName);

    console.log(`Removed: ${keyName}`);

    if (!await client.FooBarBizBaz.fetch(keyName)) {
      console.log('Complete\n');
    }

  } catch (err) {
    console.info(`${err.message}\n`);
  }
})();
