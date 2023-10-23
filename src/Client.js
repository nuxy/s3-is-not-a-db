'use strict';

const AWS = require('aws-sdk');

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
   */
  constructor(bucket, region) {
    this.#handle = null;

    this.#init(bucket, region);
  }

  /**
   * Set defaults.
   */
  #init(bucket, region) {
    this.bucket = bucket;
    this.region = region;
  }

  /**
   * Getters.
   */
  get handle() {
    return new AWS.S3({region: this.region});
  }

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
   * List objects in a S3 bucket.
   *
   * @param {String} prefix
   *   Object Prefix.
   *
   * @return {Promise<Array>}
   */
  async list(prefix) {
    if (prefix) {
      const params = {
        Bucket: this.bucket,
        Prefix: prefix,
      };

      try {
        const {Body} = await this.handle.listObjects(params).promise();

        return Body.Contents.map(data => data.Key);

      } catch (err) {
        console.warn(err.message);
        throw err;
      }
    }

    throw new Error(`Invalid Bucket Prefix: ${prefix}`);
  }

  /**
   * Delete object from S3 bucket.
   *
   * @param {String} value
   *   Object name/prefix.
   *
   * @return {Promise<Object>}
   */
  async delete(value) {
    if (isValidPrefix(value) && await this.exists(value)) {
      const params = {
        Bucket: this.bucket,
        Key: value
      };

      try {
        return await this.handle.deleteObject(params).promise();

      } catch (err) {
        console.warn(err.message);
        throw err;
      }
    }

    throw new Error(`Invalid Bucket Prefix: ${value}`);
  }

  /**
   * Fetch object from S3 bucket.
   *
   * @param {String} value
   *   Object Prefix.
   *
   * @return {Promise<Object>}
   */
  async fetch(value) {
    if (isValidPrefix(value) && await this.exists(value)) {
      const params = {
        Bucket: this.bucket,
        Key: value
      };

      try {
        const {Body} = await this.handle.getObject(params).promise();

        return Body;

      } catch (err) {
        console.warn(err.message);
        throw err;
      }
    }

    throw new Error(`Invalid Bucket Prefix: ${value}`);
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
   * @param {String} contentType
   *   Object content type (optional).
   *
   * @return {Promise<Object>}
   */
  async write(value, data, contentType) {
    if (isValidPrefix(value)) {
      const params = {
        Bucket: this.bucket,
        Key: value,
        Body: data,
        ...(contentType ? {ContentType: contentType} : {})
      };

      try {
        return await this.handle.putObject(params).promise();

      } catch (err) {
        console.warn(err.message);
        throw err;
      }
    }

    throw new Error(`Invalid Bucket Prefix: ${value}`);
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
   */
  async rename(oldValue, newValue) {
    if (!isValidPrefix(oldValue) || !(await this.exists(oldValue))) {
      return Promise.reject(new Error(`Invalid Bucket Prefix (old): ${oldValue}`));
    }

    if (!isValidPrefix(newValue) || await this.exists(newValue)) {
      return Promise.reject(new Error(`Invalid Bucket Prefix (new): ${newValue}`));
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
   * @return {Promise<Object|Error>}
   */
  async exists(value) {
    if (isValidPrefix(value)) {
      const params = {
        Bucket: this.bucket,
        Key: value
      };

      try {
        return !!(await this.handle.headObject(params).promise());

      } catch (err) {
        console.warn(err.message);
        throw err;
      }
    }

    throw new Error(`Invalid Bucket Prefix: ${value}`);
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
  return ['us-east-1', 'us-east-1', 'us-west-1', 'us-west-2'].includes(value);
}

module.exports = Client;
