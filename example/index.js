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
client.Foo.fetch('00000000-0000-0000-0000-000000000000')
  .then(data => {
    console.log(data);
  })
  .catch(err => {
    console.info(err);
  });
