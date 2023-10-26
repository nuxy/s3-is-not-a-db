'use strict';

// Local reference.
const Utils = this;

/**
 * Generate a pseudo-random string.
 *
 * @param {Number} len
 *   Character length (default: 32).
 *
 * @return {String|undefined}
 *
 * @example
 * consr result = Utils.genRandomStr(10);
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
