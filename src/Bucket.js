'use strict';

// Local modules.
const Actions = require('./bucket/Actions');
const Model   = require('./Model');

/**
 * Provides bucket interface.
 *
 * @example
 * const modelFoo = new Model('Foo');
 * modelFoo.parent = null;
 * modelFoo.fields = ['foo1', 'foo2', 'foo3'];
 *
 * const modelBar = new Model('Bar');
 * modelBar.parent = modelFoo;
 * modelBar.fields = ['bar1', 'bar2', 'bar3'];
 *
 * class Storage extends Bucket {
 *   models = [modelFoo, modelBar];
 * }
 *
 * ..
 *
 * const storage = new Storage('s3-is-not-a-db', 'us-east-1');
 */
class Bucket {
  models;

  /**
   * @param {Object} opts
   *   Configuration options.
   */
  config(opts) {
    const actions = new Actions(opts.bucket, opts.region);

    this.models.forEach(model => {
      if (model instanceof Model) {
        this[model.name] = actions;
      }
    });

    return this;
  }
}

module.exports = Bucket;
