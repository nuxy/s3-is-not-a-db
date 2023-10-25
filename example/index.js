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
    keyName = uuid();

    console.log("Test model 'Foo' with prefix 'foo'");

    await client.Foo.write(keyName, JSON.stringify({foo: 'bar'}));

    console.log(`Created: ${keyName}`);

    const data = await client.Foo.fetch(keyName);

    console.log(`Found: ${await data.transformToString()}`);

    await client.Foo.delete(keyName);

    console.log(`Removed: ${keyName}\n`);

  } catch (err) {
    console.info(err);
  }

  // .. prefix foo/bar
  try {
    keyName = uuid();

    console.log("Test model 'Bar' with prefix 'foo/bar'");

    await client.Bar.write(keyName, JSON.stringify({foo: 'bar'}));

    console.log(`Created: ${keyName}`);

    const data = await client.Bar.fetch(keyName);

    console.log(`Found: ${await data.transformToString()}`);

    await client.Bar.delete(keyName);

    console.log(`Removed: ${keyName}\n`);

  } catch (err) {
    console.info(err);
  }

  // .. prefix foo/bar/biz
  try {
    keyName = uuid();

    console.log("Test model 'Biz' with prefix 'foo/bar/biz'");

    await client.Biz.write(keyName, JSON.stringify({foo: 'bar'}));

    console.log(`Created: ${keyName}`);

    const data = await client.Biz.fetch(keyName);

    console.log(`Found: ${await data.transformToString()}`);

    await client.Biz.delete(keyName);

    console.log(`Removed: ${keyName}\n`);

  } catch (err) {
    console.info(err);
  }

  // .. prefix foo/bar/baz
  try {
    keyName = uuid();

    console.log("Test model 'Baz' with prefix 'foo/bar/biz/baz'");

    await client.Baz.write(keyName, JSON.stringify({foo: 'bar'}));

    console.log(`Created: ${keyName}`);

    const data = await client.Baz.fetch(keyName);

    console.log(`Found: ${await data.transformToString()}`);

    await client.Baz.delete(keyName);

    console.log(`Removed: ${keyName}\n`);

  } catch (err) {
    console.info(err);
  }
})();
