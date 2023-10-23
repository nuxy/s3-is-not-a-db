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
  set prefixPath(fileName) {
    this.#prefixPath = fileName;
  }

  /**
   * List objects.
   *
   * @example
   * actions.prefix = '/path/to/file/';
   *
   * const fileNames = await actions.list();
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
   * @param {String} fileName
   *   Object name/prefix.
   *
   * @return {Promise<Object|Error>}
   *
   * @example
   * actions.prefix = '/path/to/file/';
   *
   * await actions.delete('file.ext');
   */
  async delete(fileName) {
    return await this.#client.delete(`${this.#prefixPath}/${fileName}`);
  }

  /**
   * Fetch object.
   *
   * @param {String} fileName
   *   Object name/prefix.
   *
   * @return {Promise<Object|Error>}
   *
   * @example
   * actions.prefix = '/path/to/file/';
   *
   * const data = await actions.fetch('file.ext');
   */
  async fetch(fileName) {
    return await this.#client.fetch(`${this.#prefixPath}/${fileName}`);
  }

  /**
   * Write object.
   *
   * @param {String} fileName
   *   Object name/prefix.
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
   * actions.prefix = '/path/to/file/';
   *
   * await actions.write('file.ext', 'foo', 'text/plain');
   */
  async write(fileName, data, contentType) {
    return await this.#client.write(`${this.#prefixPath}/${fileName}`, data, contentType);
  }

  /**
   * Rename object.
   *
   * @param {String} oldFileName
   *   Old Object as string.
   *
   * @param {String} newFileName
   *   New object as string.
   *
   * @return {Promise<Object|Error>}
   *
   * @example
   * actions.prefix = '/path/to/file/';
   *
   * await actions.rename('file1.ext', 'file2.ext');
   */
  async rename(oldFileName, newFileName) {
    return await this.#client.rename(
      `${this.#prefixPath}/${oldFileName}`, `${this.#prefixPath}/${newFileName}`
    );
  }

  /**
   * Check object exists.
   *
   * @param {String} fileName
   *   Object name/prefix.
   *
   * @return {Promise<Object|Error>}
   *
   * @example
   * actions.prefix = '/path/to/file/';
   *
   * const exists = await actions.exists('file.ext');
   */
  async exists(fileName) {
    return await this.#client.exists(`${this.#prefixPath}/${fileName}`);
  }
}

module.exports = BucketActions;
