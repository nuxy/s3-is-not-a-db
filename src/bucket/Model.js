'use strict';

/**
 * Provides bucket data representation.
 */
class BucketModel {
  #name;
  #parent;
  #fields;
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

    this._init(name);
  }

  /**
   * Set defaults.
   */
  _init(name) {
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
}

module.exports = BucketModel;
