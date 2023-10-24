'use strict';

// Local reference.
const Common = this;

/**
 * Return Pascal Case formatted string.
 *
 * @param {String} valueChanged(newValue) {
 *   String value to convert.
 *
 * @return {String}
 *
 * @example
 * const result = pascalCase('foo-bar_BizBaz);
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
