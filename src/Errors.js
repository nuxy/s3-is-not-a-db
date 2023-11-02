/** @module Errors */

/**
 *  S3 is NOT a DB
 *  Simple interface to using Amazon S3 as a database.
 *
 *  Copyright 2023, Marc S. Brooks (https://mbrooks.info)
 *  Licensed under the MIT license:
 *  http://www.opensource.org/licenses/mit-license.php
 */

'use default';

const messages = {
  INVALID_BUCKET_PREFIX: 'Invalid Bucket Prefix: %s',
  INVALID_MODEL_DATA:    'Invalid Model data: %s',
  INVALID_MODEL_TYPE:    'Invalid Model type: %s',
  INVALID_OBJECT_TARGET: 'Invalid Object target: %s',
  INVALID_MESSAGE_CODE:  'Invalid message code',
  MODEL_NAME_EXISTS:     "Cannot redeclare name '%s' in Model",
  OBJECT_LOCK_EXISTS:    'Lock exists for: %s'
};

/**
 * Throw new Error with message.
 *
 * @params {String}
 *   Errors message.
 *
 * @params {String}
 *   Replacement value.
 *
 * @example
 * Utils.throwError('This "%s" and that "%s"', 'foo', 'bar', ..);
 * // This "foo" and "bar"
 */
function throwError() {
  const args = arguments;
  const code = args[0];

  if (messages.hasOwnProperty(code)) {
    let str = messages[code];

    for (var i = 1; i < args.length; i++) {
      str = str.replace(/\%s/i, args[i]);
    }

    throw new Error(str);
  }

  throw new Error(messages.INVALID_MESSAGE_CODE);
}

module.exports = {throwError};
