'use strict';

// Local modules.
const Bucket = require(`${PACKAGE_ROOT}/src/Bucket`);
const Model  = require(`${PACKAGE_ROOT}/src/Model`);

/**
 * Model /foo
 */
const modelFoo = new Model('foo');
modelFoo.parent = null;
modelFoo.fields = ['foo1', 'foo2', 'foo3'];

/**
 * Model /foo/bar
 */
const modelBar = new Model('bar');
modelBar.parent = modelFoo;
modelBar.fields = ['bar1', 'bar2', 'bar3'];

/**
 * Model /foo/bar/biz
 */
const modelBiz = new Model('biz');
modelBiz.parent = modelBar;
modelBiz.fields = ['biz1', 'biz2', 'biz3'];

/**
 * Model /foo/bar/biz/baz
 */
const modelBaz = new Model('baz');
modelBaz.parent = modelBiz;
modelBaz.fields = ['baz1', 'baz2', 'baz3'];

/**
 * Construct storage template.
 */
class Storage extends Bucket {
  models = [modelFoo, modelBar, modelBiz, modelBaz];
}

module.exports = Storage;
