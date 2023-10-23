'use strict';

// Local modules.
const Client = require('../Client');

/**
 * Provides bucket actions.
 */
class BucketActions {
  #client;

  /**
   * @param {Object} bucket
   *   S3 Bucket name.
   *
   * @param {Object} region
   *   S3 Region name.
   */
  constructor(bucket, region) {
    this.#client = new Client(bucket, region);
  }

  /**
   * List objects.
   */
  list() {
    return 'LIST';
  }

  /**
   * Delete object.
   */
  delete() {
    return 'DELETE';
  }

  /**
   * Fetch object.
   */
  fetch() {
    return 'FETCH';
  }

  /**
   * Write object.
   */
  write() {
    return 'WRITE';
  }

  /**
   * Rename object.
   */
  rename() {
    return 'RENAME';
  }

  /**
   * Check object exists.
   */
  exists() {
    return 'EXISTS';
  }
}

module.exports = BucketActions;
