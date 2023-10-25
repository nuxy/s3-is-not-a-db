'use strict';

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
  const keyName = '00000000-0000-0000-0000-00000000000.json';

  // .. prefix foo
  try {
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
