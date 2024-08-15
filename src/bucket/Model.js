/**
 *  S3 is NOT a DB
 *  Simple interface to using Amazon S3 as a database.
 *
 *  Copyright 2023-2024, Marc S. Brooks (https://mbrooks.info)
 *  Licensed under the MIT license:
 *  http://www.opensource.org/licenses/mit-license.php
 */

'use strict';

/**
 * Provides bucket data representation.
 */
class BucketModel {
  #name;
  #parent;
  #fields;
  #type;
  #index = 0;

  /**
   * @param {String} name
   *   Model name.
   *
   * @example
   * const modelFoo  = new BucketModel('foo');
   * modelFoo.parent = null;
   * modelFoo.fields = ['foo', 'bar', 'baz'];
   */
  constructor(name) {
    this.#name   = name;
    this.#parent = null;
    this.#fields = null;
    this.#type   = null;
    this.#init(name);
  }

  /**
   * Set defaults.
   *
   * @private
   */
  #init(name) {
    this.name = name;
  }

  // Getters.
  get name() {
    return this.#name;
  }

  get parent() {
    return this.#parent;
  }

  get fields() {
    return this.#fields;
  }

  get type() {
    return this.#type;
  }

  get index() {
    return this.#index;
  }

  // Setters.
  set name(value) {
    if (BucketModel.isValidName(value)) {
      this.#name = value;
    }
  }

  set parent(value) {
    if (BucketModel.isValidParent(value)) {
      this.#parent = value;
      this.#index = this.#parent.index + 1;
    }
  }

  set fields(arr) {
    if (BucketModel.isValidFields(arr)) {
      this.#fields = arr;
      this.#type = 'json';
    }
  }

  set type(value) {
    if (BucketModel.isValidType(value)) {
      this.#type = value;
    }
  }

  /**
   * Verify the Modal name format.
   *
   * @param {String} value
   *  Name value to validate.
   *
   * @return {Boolean}
   *
   * @example
   * const result = BucketModel.isValidName('foo');
   */
  static isValidName(value) {
    return value && /^[a-z0-9-_]+$/i.test(value);
  }

  /**
   * Verify the Modal parent type.
   *
   * @param {String} value
   *  Parent value to validate.
   *
   * @return {Boolean}
   *
   * @example
   * const result = BucketModel.isValidParent(BucketModel);
   */
  static isValidParent(value) {
    return value instanceof BucketModel;
  }

  /**
   * Verify the Modal field format.
   *
   * @param {Array<String>} arr
   *  Fields names to validate.
   *
   * @return {Boolean}
   *
   * @example
   * const result = BucketModel.isValidFields(['foo', 'bar', biz', 'baz');
   */
  static isValidFields(arr) {
    return Array.isArray(arr) && arr.every(item => typeof item === 'string');
  }

  /**
   * Verify the Modal output type.
   *
   * @param {String} value
   *  Check type value (options: base64|blob|json|text)
   *
   * @return {Boolean}
   *
   * @example
   * const result = BucketModel.isValidType('json');
   */
  static isValidType(value) {
    return ['base64', 'blob', 'json', 'text'].includes(value);
  }
}

module.exports = BucketModel;
