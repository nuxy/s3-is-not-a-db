'use strict';

// Local modules.
const Actions = require('./bucket/Actions');
const Model   = require('./Model');

/**
 * Provides bucket interface.
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
