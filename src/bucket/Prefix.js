/**
 *  S3 is NOT a DB
 *  Simple interface to using Amazon S3 as a database.
 *
 *  Copyright 2023, Marc S. Brooks (https://mbrooks.info)
 *  Licensed under the MIT license:
 *  http://www.opensource.org/licenses/mit-license.php
 */

/**
 * Provides methods to parse path parameters.
 */
class BucketPrefix {
  #model;

  /**
   * @param {Model} model
   *   Model instance.
   *
   * @example
   * const prefix = new BucketPrefix(modelFoo);
   */
  constructor(model) {
    this.#model = model;
  }

  /**
   * Return path root parameter.
   *
   * @return {String}
   *
   * @example
   * const param = prefix.rootParam();
   * // foo
   */
  rootParam() {
    return this.getParam(1);
  }

  /**
   * Return path last parameter.
   *
   * @return {String}
   *
   * @example
   * const param = prefix.lastParam();
   * // baz
   */
  lastParam() {
    return this.#model.name;
  }

  /**
   * Return array of path parameters (ordered by index).
   *
   * @return {Array<String>}
   *
   * @example
   * const params = prefix.params();
   * // ['foo', 'bar', 'biz', 'baz']
   */
  params() {
    let index = this.#model.index;
    let model = this.#model.parent;

    const arr = [this.#model.name];

    while (index-- > 0) {
      arr.push(model.name);

      model = model.parent;
    }

    return arr.reverse();
  }

  /**
   * Return path parameter for a given position.
   *
   * Example:
   *   Bucket Prefix /foo/bar/biz/baz
   *   Position      | 1 | 2 | 3 | 4
   *
   * @param {Number} pos
   *   Bucket Prefix position (default: 1).
   *
   * @return {String}
   *
   * @example
   * const param = prefix.getParam(2);
   * // bar
   */
  getParam(pos = 1) {
    return this.params()[pos - 1];
  }

  /**
   * Return path relative to Model position.
   *
   * @return {String}
   *
   * @example
   * const param = prefix.path();
   * // foo/bar/biz/baz
   */
  path() {
    return this.params().join('/');
  }
}

export default BucketPrefix;
