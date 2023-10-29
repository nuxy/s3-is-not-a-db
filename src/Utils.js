'use strict';

// Local reference.
const Utils = this;

/**
 * Compare two arrays of strings.
 *
 * @param {Array} arr1
 *   Array one.
 *
 * @param {Array} arr2
 *   Array two.
 *
 * @return {Boolean}
 *
 * @example
 * const result = Utils.compareArrays(
 *   ['foo','bar','biz'],
 *   ['bar','qux','baz']
 * );
 * // false
 */
exports.compareArrays = function(arr1, arr2) {
  if (Array.isArray(arr1) && Array.isArray(arr2) && arr1.length === arr2.length) {
    arr1.sort();
    arr2.sort();

    return arr1.every((item, index) => item === arr2[index]);
  }

  return false;
};

/**
 * Generate a pseudo-random string.
 *
 * @param {Number} len
 *   Character length (default: 32).
 *
 * @return {String|undefined}
 *
 * @example
 * const result = Utils.genRandomStr(10);
 */
exports.genRandomStr = function(len = 32) {
  let chars = 'abcdefghjkmnopqrstuvwxyzABCDEFGHIJKLMNPQRSTUVWXYZ23456789'
    .split('');

  // Perform (Durstenfeld) shuffle.
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = chars[i];

    chars[i] = chars[j];
    chars[j] = tmp;
  }

  chars = chars.join('');

  let str = '';

  // Trim string to length.
  for (let i = 0; i < len; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return str || undefined;
};

/**
 * Check if value is an Object instance.
 *
 * @param {Object}
 *   Object to check.
 *
 * @return {Boolean}
 *
 * @example
 * const result = Utils.isObject({foo: 'bar'});
 * // true
 */
exports.isObject = function(value) {
  return typeof value === 'object' && Object.prototype.toString.call(value) === '[object Object]';
};

/**
 * Return Pascal Case formatted string.
 *
 * @param {String} valueChanged(newValue) {
 *   String value to convert.
 *
 * @return {String}
 *
 * @example
 * const result = Utils.pascalCase('foo-bar_BizBaz);
 * // FooBarBizBaz
 */
exports.pascalCase = function(value) {
  value = value.replace(/[^a-z-_ ]/gi, '-');

  let parts = value.split(/[-_ ]/g);

  parts = parts.map(str => {
    return (/^[A-Z]+$/.test(str))
      ? str.toLowerCase() : str;
  });

  parts = parts.map(str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  });

  return parts.join('');
};
