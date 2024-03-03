/**
 *  S3 is NOT a DB
 *  Simple interface to using Amazon S3 as a database.
 *
 *  Copyright 2023, Marc S. Brooks (https://mbrooks.info)
 *  Licensed under the MIT license:
 *  http://www.opensource.org/licenses/mit-license.php
 */

// Local modules.
import Client from '../Client.js';

import {
  compareArrays,
  isObject,
  genRandomStr,
} from '../Utils.js';

import {throwError} from '../Errors.js';

/**
 * Provides bucket actions.
 */
class BucketActions {
  #client;
  #name;
  #dataFields;
  #outputType;
  #prefixPath;
  #lockOwner;

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
  get name() {
    return this.#name;
  }

  get dataFields() {
    return this.#dataFields;
  }

  get outputType() {
    return this.#outputType;
  }

  get prefixPath() {
    return this.#prefixPath;
  }

  // Setters.
  set name(value) {
    this.#name = value;
  }

  set dataFields(value) {
    this.#dataFields = value;
  }

  set outputType(value) {
    this.#outputType = value;
  }

  set prefixPath(value) {
    this.#prefixPath = value;
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
    if (!this.lockOwner && await this.isLocked(keyName)) {
      throwError('OBJECT_LOCK_EXISTS', keyName);
    }

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
    if (!this.lockOwner && await this.isLocked(keyName)) {
      throwError('OBJECT_LOCK_EXISTS', keyName);
    }

    const data = await this.#client.fetch(`${this.#prefixPath}/${keyName}`);

    if (data) {
      switch (this.#outputType) {
        case 'base64':
          return await data.transformToString('base64');

        case 'blob':
          return await data.transformToByteArray();

        case 'json':
          return JSON.parse(await data.transformToString());

        default:
          return await data.transformToString();
      }
    }
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
   *   Object content type (default: 'text/plain')
   *
   * @return {Promise<Object|Error>}
   *
   * @example
   * actions.prefix = 'path/to/object';
   *
   * await actions.write('keyName', 'foo');
   *   ..
   *
   * await actions.write('keyName', {foo1: 'bar'});
   *   ..
   *
   * await actions.write('keyName', <Buffer>, 'image/jpeg; charset=utf-8');
   */
  async write(keyName, data, contentType = 'text/plain') {
    if (!this.lockOwner && await this.isLocked(keyName)) {
      throwError('OBJECT_LOCK_EXISTS', keyName);
    }

    if (this.#dataFields && isObject(data)) {

      // Validate object keys.
      if (!this.isValidData(data)) {
        const keyDiff = `${Object.keys(data)} <> ${this.#dataFields}`;

        throwError('INVALID_MODEL_FIELDS', keyDiff, this.#name);
      }

      contentType = 'application/json';

      // Convert object to JSON
      data = JSON.stringify(data);
    }

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
    if (!this.lockOwner && await this.isLocked(oldKeyName)) {
      throwError('OBJECT_LOCK_EXISTS', oldKeyName);
    }

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
   * @return {Promise<Object|Boolean|Error>}
   *
   * @example
   * actions.prefix = 'path/to/object';
   *
   * const exists = await actions.exists('keyName');
   */
  async exists(keyName) {
    return await this.#client.exists(`${this.#prefixPath}/${keyName}`);
  }

  /**
   * Execute a batch operation in sequential order.
   * Use "Pessimistic Locking" for data integrity.
   *
   * @param {String} keyName
   *   Object name.
   *
   * @param {Array<Promise>} actions
   *   Array of promised Actions.
   *
   * @return {Promise|Error}
   *
   * @example
   * const keyName = 'file.json';
   * const operations = [];
   *
   * // Fetch the object.
   * operations.push(() => {
   *   return actions.fetch(keyName);
   * });
   *
   * // Update existing data.
   * operations.push(data => {
   *   return actions.write(keyName, {...data, foo: 'bar'}));
   * });
   *
   * actions.batch(keyName, operations)
   *   .catch(function(err) {
   *     console.warn(err.message);
   *   });
   */
  async batch(keyName, actions) {

    // Set exclusive lock (first operation).
    actions.unshift(() => {
      return this.lockObject(keyName);
    });

    // Remove exclusive lock (last operation).
    actions.push(() => {
      return this.unlockObject(keyName)
        .then(() => {
          this.lockOwner = null;
        });
    });

    return actions.reduce(function(current, next) {
      return current.then(next);
    }, Promise.resolve([]))
      .catch(function(err) {
        throw new Error(err.message);
      });
  }

  /**
   * Check object lock exists.
   *
   * @param {String} keyName
   *   Object name.
   *
   * @return {Promise<Boolean|Error>}
   *
   * @example
   * actions.prefix = 'path/to/object';
   *
   * const result = await actions.isLocked('keyName');
   */
  async isLocked(keyName) {
    const data = await this.exists(`${keyName}.lock`);

    const ownerId = data?.Metadata?.ownerId;

    if (ownerId && ownerId !== this.#lockOwner) {
      return false;
    }

    return !!data;
  }

  /**
   * Create object lock.
   *
   * @param {String} keyName
   *   Object name.
   *
   * @return {Promise<undefined|Error>}
   *
   * @example
   * actions.prefix = 'path/to/object';
   *
   * await actions.lockObject('keyName');
   */
  async lockObject(keyName) {
    const data = await this.isLocked(keyName);

    if (data) {
      throwError('OBJECT_LOCK_EXISTS', keyName);
    }

    const ownerId = genRandomStr();

    await this.write(keyName, '', {metaData: {ownerId}});

    this.lockOwner = ownerId;
  }

  /**
   * Remove object lock.
   *
   * @param {String} keyName
   *   Object name.
   *
   * @return {Promise<undefined|Error>}
   *
   * @example
   * actions.prefix = 'path/to/object';
   *
   * await actions.unlockObject('keyName');
   */
  async unlockObject(keyName) {
    const data = await this.isLocked(keyName);

    if (data) {
      await this.delete(keyName);
    }
  }

  /**
   * Check object keys match Model fields.
   *
   * @param {Object} obj
   *   Data as object.
   *
   * @return {Boolean}
   *
   * @example
   * const result = actions.isValidData({foo: true, bar: false});
   */
  isValidData(obj) {
    return compareArrays(this.#dataFields, Object.keys(obj));
  }
}

export default BucketActions;
