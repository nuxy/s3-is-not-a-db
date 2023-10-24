'use strict';

// Local modules.
const Actions = require('./bucket/Actions');
const Prefix  = require('./bucket/Prefix');
const Model   = require('./Model');
const Common  = require('./Common');

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
    this.models.forEach(model => {
      if (model instanceof Model) {
        const name = Common.pascalCase(model.name);

        if (!this[name]) {
          const actions = new Actions(opts.bucket, opts.region);

          actions.prefixPath = (new Prefix(model)).path();

          // Define property (instance of Actions).
          this[name] = actions;

        } else /* istanbul ignore next */ {
          throw new Error(`Cannot redeclare name ${name} in Model`);
        }
      }
    });

    return this;
  }
}

module.exports = Bucket;
