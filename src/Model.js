'use strict';

/**
 * Provides data representation and methods.
 */
class Model {
  #name;
  #parent;
  #fields;
  #index = 0;

  /**
   * @param {String} name
   *   Model name.
   *
   * @example
   * const modelFoo  = new Model('foo');
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
    if (Model.isValidName(value)) {
      this.#name = value;
    }
  }

  set parent(value) {
    if (Model.isValidParent(value)) {
      this.#parent = value;
      this.#index = this.#parent.index + 1;
    }
  }

  set fields(arr) {
    if (Model.isValidFields(arr)) {
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
   * const result = Model.isValidName('foo');
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
   * const result = Model.isValidParent(Model);
   */
  static isValidParent(value) {
    return value instanceof Model;
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
   * const result = Model.isValidFields(['foo', 'bar', biz', 'baz');
   */
  static isValidFields(arr) {
    return Array.isArray(arr) && arr.every(item => typeof item === 'string');
  }
}

module.exports = Model;
