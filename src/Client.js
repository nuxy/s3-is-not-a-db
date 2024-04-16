/**
 *  S3 is NOT a DB
 *  Simple interface to using Amazon S3 as a database.
 *
 *  Copyright 2023, Marc S. Brooks (https://mbrooks.info)
 *  Licensed under the MIT license:
 *  http://www.opensource.org/licenses/mit-license.php
 */

'use strict';

const {
  BucketLocationConstraint
} = require('@aws-sdk/client-s3/dist-cjs');

const {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client
} = require('@aws-sdk/client-s3');

const {
  throwError
} = require('./Errors');

/**
 * Provides S3 client methods.
 */
class Client {
  #handle;
  #bucket;
  #region;

  /**
   * @param {Object} bucket
   *   S3 Bucket name.
   *
   * @param {Object} region
   *   S3 Region name.
   *
   * @example
   * const client = new Client('s3-is-not-a-db', 'us-east-1');
   */
  constructor(bucket, region) {
    this.#init(bucket, region);
  }

  /**
   * Set defaults.
   */
  #init(bucket, region) {
    this.bucket = bucket;
    this.region = region;
    this.#initHandler();
  }

  /**
   * Getters.
   */
  get bucket() {
    return this.#bucket;
  }

  get region() {
    return this.#region;
  }

  // Setters.
  set bucket(value) {
    if (isValidBucket(value)) {
      this.#bucket = value;
    }
  }

  set region(value) {
    if (isValidRegion(value)) {
      this.#region = value;
    }
  }

  /**
   * Initialize S3 client handler.
   */
  #initHandler() {
    this.#handle = new S3Client({region: this.#region});
  }

  /**
   * List objects in a S3 bucket.
   *
   * @param {String} prefix
   *   Object Prefix.
   *
   * @return {Promise<Array|Error>}
   *
   * @example
   * const objects = await client.list('/path/to/objects');
   * // ['foo.ext', 'bar.ext', 'biz.ext', 'baz.ext']
   */
  async list(prefix) {
    if (prefix) {
      const command = new ListObjectsV2Command({
        Bucket: this.bucket,
        Prefix: prefix,
      });

      try {
        let isTruncated = true;

        const contents = [];

        while (isTruncated) {
          const {Contents, IsTruncated, NextContinuationToken}
            = await this.#handle.send(command);

          contents.push(...Contents.map(content => content.Key));

          isTruncated = IsTruncated;

          command.input.ContinuationToken = NextContinuationToken;
        }

        return contents;

      } catch (err) /* istanbul ignore next */ {
        console.warn(err.message);
        throw err;
      }
    }

    throwError('INVALID_BUCKET_PREFIX', prefix);
  }

  /**
   * Delete object from S3 bucket.
   *
   * @param {String} value
   *   Object name/prefix.
   *
   * @return {Promise<Object|Error>}
   *
   * @example
   * await client.delete('/path/to/keyName');
   */
  async delete(value) {
    if (isValidPrefix(value)) {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: value
      });

      try {
        return await this.#handle.send(command);

      } catch (err) /* istanbul ignore next */ {
        console.warn(err.message);
        throw err;
      }
    }

    throwError('INVALID_BUCKET_PREFIX', value);
  }

  /**
   * Fetch object from S3 bucket.
   *
   * @param {String} value
   *   Object Prefix.
   *
   * @return {Promise<Object|Error>}
   *
   * @example
   * const data = await client.fetch('/path/to/keyName');
   */
  async fetch(value) {
    if (isValidPrefix(value)) {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: value
      });

      try {
        const response = await this.#handle.send(command);

        return await response.Body;

      } catch (err) /* istanbul ignore next */ {
        if (err.name !== 'NoSuchKey') {
          console.warn(err.message);
          throw err;
        }

        return false;
      }
    }

    throwError('INVALID_BUCKET_PREFIX', value);
  }

  /**
   * Write/overwrite object in S3 bucket.
   *
   * @param {String} value
   *   Object Prefix.
   *
   * @param {String|Buffer} data
   *   Object data.
   *
   * @param {Object<contentType|metaData>} options
   *   Request options.
   *
   * @return {Promise<Object|Error>}
   *
   * @example
   * await client.write('/path/to/keyName', 'foo', 'text/plain');
   */
  async write(value, data, options) {
    if (isValidPrefix(value)) {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: value,
        Body: data,
        ContentType: options?.contentType,
        ContentLength: (data) ? Buffer.from(data).size : 0,
        Metadata: options?.metaData,
      });

      try {
        return await this.#handle.send(command);

      } catch (err) /* istanbul ignore next */ {
        console.warn(err.message);
        throw err;
      }
    }

    throwError('INVALID_BUCKET_PREFIX', value);
  }

  /**
   * Rename object in S3 bucket.
   *
   * @param {String} oldValue
   *   Old object Prefix as string.
   *
   * @param {String} newValue
   *   New object Prefix as string.
   *
   * @return {Promise<Object|Error>}
   *
   * @example
   * await client.rename('/path/to/keyName1', '/path/to/keyName2');
   */
  async rename(oldValue, newValue) {
    if (!isValidPrefix(oldValue) || !(await this.exists(oldValue))) {
      throwError('INVALID_BUCKET_PREFIX', oldValue);
    }

    if (!isValidPrefix(newValue) || await this.exists(newValue)) {
      throwError('INVALID_OBJECT_TARGET', newValue);
    }

    const data = await this.fetch(oldValue);
    const json = JSON.stringify(data);

    await this.delete(oldValue);

    await this.write(newValue, json, 'application/json');
  }

  /**
   * Check object exists in S3 bucket.
   *
   * @param {String} value
   *   Object Prefix as string.
   *
   * @return {Promise<Object|Boolean|Error>}
   *
   * @example
   * const exists = await client.exists('/path/to/keyName');
   */
  async exists(value) {
    if (isValidPrefix(value)) {
      const command = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: value
      });

      try {
        return await this.#handle.send(command);

      } catch (err) /* istanbul ignore next */ {
        if (err.name !== 'NotFound') {
          console.warn(err.message);
          throw err;
        }

        return false;
      }
    }

    throwError('INVALID_BUCKET_PREFIX', value);
  }
}

/**
 * Verify Bucket format.
 *
 * @param {String} value
 *  Value as string.
 *
 * @return {Boolean}
 */
function isValidBucket(value) {
  return value.length > 0 && /^[a-z0-9-_.]{3,63}$/.test(value);
}

/**
 * Verify Bucket Prefix (path) format.
 *
 * @param {String} value
 *  Value as string.
 *
 * @return {Boolean}
 */
function isValidPrefix(value) {
  return value.length > 0 && /^[a-z0-9-_!.*()'\/]+$/i.test(value);
}

/**
 * Verify Bucket Region name format.
 *
 * @param {String} value
 *  Value as string.
 *
 * @return {Boolean}
 */
function isValidRegion(value) {
  const list = Object.values(BucketLocationConstraint);

  return value === 'us-east-1' || list.includes(value);
}

module.exports = Client;
