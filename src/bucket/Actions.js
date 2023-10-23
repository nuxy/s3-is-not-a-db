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
   */
  async exists(fileName) {
    return await this.#client.exists(`${this.#prefixPath}/${fileName}`);
  }
}

module.exports = BucketActions;
