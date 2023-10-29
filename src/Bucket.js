'use strict';

// Local modules.
const Actions = require('./bucket/Actions');
const Prefix  = require('./bucket/Prefix');
const Model   = require('./bucket/Model');
const Utils   = require('./Utils');

const {
  throwError
} = require('./Errors');

/**
 * Provides bucket interface.
 *
 * @example
 * const modelFoo = new Model('foo');
 * modelFoo.parent = null;
 * modelFoo.fields = ['foo1', 'foo2', 'foo3'];
 *
 * const modelBar = new Model('bar');
 * modelBar.parent = modelFoo;
 * modelBar.fields = ['bar1', 'bar2', 'bar3'];
 *
 * class Storage extends Bucket {
 *   models = [modelFoo, modelBar];
 * }
 *
 *   ..
 *
 * const storage = new Storage();
 *
 * const client = storage.config({
 *   bucket: 's3-is-not-a-db',
 *   region: 'us-east-1'
 * });
 *
 * client.<Model>.<Action>()
 */
class Bucket {
  models;

  /**
   * @param {Object} opts
   *   Configuration options.
   */
  config(opts) {
    this.models.forEach(model => {
      if (model instanceof Model) {
        const actions = new Actions(opts.bucket, opts.region);

        actions.dataFields = model.fields;
        actions.prefixPath = (new Prefix(model)).path();

        Object.freeze(actions);

        // format PascalCase
        const name = Utils.pascalCase(actions.prefixPath);

        // Define property (instance of Actions).
        this[name] = actions;

      } else {
        throwError('INVALID_MODEL_TYPE', typeof model);
      }
    });

    return this;
  }
}

module.exports = Bucket;
