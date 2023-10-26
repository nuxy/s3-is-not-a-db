'use strict';

// Local modules.
const Client = require('../Client');

/**
 * Provides bucket actions.
 */
class BucketActions {
  #client;
  #prefixPath;

  /**
   * @param {Object} bucket
   *   S3 Bucket name.
   *
   * @param {Object} region
   *   S3 Region name.
   *
   * @example
   * const actions = new Actions('s3-is-not-a-db', 'us-east-1');
   */
  constructor(bucket, region) {
    this.#client = new Client(bucket, region);
  }

  // Getters.
  get prefixPath() {
    return this.#prefixPath;
  }

  // Setters.
  set prefixPath(keyName) {
    this.#prefixPath = keyName;
  }

  /**
   * List objects.
   *
   * @example
   * actions.prefix = 'path/to/objects';
   *
   * const objects = await actions.list();
   * // ['foo.ext', 'bar.ext', 'biz.ext', 'baz.ext']
   *
   * @return {Promise<Object|Error>}
   */
  async list() {
    return await this.#client.list(this.#prefixPath);
  }

  /**
   * Delete object.
   *
   * @param {String} keyName
   *   Object name.
   *
   * @return {Promise<Object|Error>}
   *
   * @example
   * actions.prefix = 'path/to/object';
   *
   * await actions.delete('keyName');
   */
  async delete(keyName) {
    return await this.#client.delete(`${this.#prefixPath}/${keyName}`);
  }

  /**
   * Fetch object.
   *
   * @param {String} keyName
   *   Object name.
   *
   * @return {Promise<Object|Error>}
   *
   * @example
   * actions.prefix = 'path/to/object';
   *
   * const data = await actions.fetch('keyName');
   */
  async fetch(keyName) {
    return await this.#client.fetch(`${this.#prefixPath}/${keyName}`);
  }

  /**
   * Write object.
   *
   * @param {String} keyName
   *   Object name.
   *
   * @param {String|Buffer} data
   *   Object data.
   *
   * @param {String} contentType
   *   Object content type (optional).
   *
   * @return {Promise<Object|Error>}
   *
   * @example
   * actions.prefix = 'path/to/object';
   *
   * await actions.write('keyName', 'foo', 'text/plain');
   */
  async write(keyName, data, contentType) {
    return await this.#client.write(`${this.#prefixPath}/${keyName}`, data, contentType);
  }

  /**
   * Rename object.
   *
   * @param {String} oldKeyName
   *   Old Object as string.
   *
   * @param {String} newKeyName
   *   New object as string.
   *
   * @return {Promise<Object|Error>}
   *
   * @example
   * actions.prefix = 'path/to/object';
   *
   * await actions.rename('keyName1', 'keyName2');
   */
  async rename(oldKeyName, newKeyName) {
    return await this.#client.rename(
      `${this.#prefixPath}/${oldKeyName}`, `${this.#prefixPath}/${newKeyName}`
    );
  }

  /**
   * Check object exists.
   *
   * @param {String} keyName
   *   Object name.
   *
   * @return {Promise<Object|Error>}
   *
   * @example
   * actions.prefix = 'path/to/object';
   *
   * const exists = await actions.exists('keyName');
   */
  async exists(keyName) {
    return await this.#client.exists(`${this.#prefixPath}/${keyName}`);
  }
}

module.exports = BucketActions;
