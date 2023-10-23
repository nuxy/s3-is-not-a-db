'use strict';

// Local modules.
const Storage = require('./Storage');
const storage = new Storage();

const client = storage.config({
  bucket: 's3-is-not-a-db',
  region: 'us-east-1'
});

const data = client.Foo.fetch('00000000-0000-0000-0000-000000000000');

console.log('DATA', data);
