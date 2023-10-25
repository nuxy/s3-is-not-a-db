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
  const keyName = '00000000-0000-0000-0000-000000000000.json';

  try {
    await client.Foo.write(keyName, JSON.stringify({foo: 'bar'}));

    console.log(`Created: ${keyName}`);

    const data = await client.Foo.fetch(keyName);

    console.log(`Found: ${data.toString('utf-8')}`);

    await client.Foo.delete(keyName);

    console.log(`Removed: ${keyName}`);

  } catch (err) {
    console.info(err);
  }
})();
