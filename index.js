/* Created by raisch on 4/16/15. */

/*jshint node:true, bitwise:true, camelcase:false, curly:true, undef:false, unused:false, eqeqeq:true, shadow:true, expr:true */
/*global define, require*/

'use strict';

//@formatter:off
/** @ignore */
var _         = require('lodash'),
    chai      = require('chai');
//@formatter:on

/**
 * @module chai-joi
 * @version 0.0.5
 * @mixes chai
 *
 * @description
 * Extends Chai with Joi specific assertions.
 *
 * See test/chai-joi.js for possible uses.
 *
 * @example
 *
 * var joi    = require('joi'),
 *     chai   = require('chai')
 *     expect = chai.expect;
 *
 * chai.should();
 *
 * chai.use( require('chai-joi') );
 *
 * var data={
 *   str:'foo',
 *   num: 100
 * };
 *
 * var schema=joi.object({
 *   str:joi.string().allow(''),
 *   num:joi.number().min(1).max(10)
 * });
 *
 * var result=joi.validate(data,schema);
 *
 * result.should.not.validate;
 * result.should.have.errmsg('"value" must be less than or equal to 10');
 *
 * data.num=1;
 * result=joi.validate(data,schema);
 *
 * expect(result).to.validate;
 * expect(result).to.not.have.errmsgs; // same thing, really.
 *
 */

/**
 * Returns a (possibly empty) array of error messages from a Joi.validate response.
 * @param {object} result
 * @returns {*|Array}
 * @private
 */
var getErrmsgs = function (result) {
  var err = result.error || {},
      details = err.details || [],
      errmsgs = _.pluck(details, 'message');
  return errmsgs || [];
};

/**
 * @namespace assert
 *
 * @description
 *
 * Extension to chai.assert to test for a valid Joi validation result.
 *
 */

//noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols
/**
 * Asserts that the target object is result of a call to Joi.validate()
 * @param {object} target
 * @returns {boolean}
 */
function isValidation(target) { //stub for jsdoc
  return true;
}

/**
 * @namespace property
 *
 * @description
 *
 * Chainable properties.
 *
 */

/**
 * Assert that target is a Joi validation
 * @example
 * expect(target).to.[not].be.a.validation
 * target.should.[not].be.a.validation
 */
var validation = function () {
  var target = this._obj;
  this.assert(_.isObject(target), '#{this} is not a Joi validation because it must be an object');
  this.assert(!_.isEmpty(target), '#{this} is not a Joi validation because it is an empty object');
  var fields = _.keys(target);
  this.assert(_.contains(fields, 'value', 'error'), '#{this} is not a Joi validation because it is missing required keys');
  target = _.omit(target, ['error', 'value']);
  this.assert(_.isEmpty(target), '#{this} is not a validation because it contains unexpected keys');
};

/**
 * Assert that target validates correctly
 * @example
 * expect(target).should.[not].validate
 * target.should.[not].validate
 */
var validate = function () {
  var target = this._obj;
  chai.assert.isValidation(target);
  this.assert(_.has(target, 'error') && null === target.error,
      '#{this} should validate but does not',
      '#{this} should not validate but it does'
  );
};

/**
 * Assert that target contains one or more errors (unsuccessful validation).
 * Mutates current chainable object to be target.error.
 * @example
 * expect(target).to.[not].have.an.error
 * target.should.[not].have.an.error
 */
var error = function (utils) {
  var target = this._obj;
  chai.assert.isValidation(target);
  var error = target.error || null,
      json = JSON.stringify(target, null, '\t');
  this.assert(null !== error,
      '#{this} should have error but does not: ' + json,
      '#{this} should not not have error but does: ' + json
  );
  utils.flag(this, 'object', error);
};

/**
 * Assert that target contains a value.
 * Mutates current chainable object to be target.value.
 * @example
 * expect(target).to.[not].have.a.value
 * target.should.[not].have.a.value
 */
var value = function value(utils) {
  var target = this._obj,
      value = target.value || null;
  chai.assert.isValidation(target);
  this.assert(null !== value,
      '#{this} should have value',
      '#{this} should not have value'
  );
  utils.flag(this, 'object', value);
};

/**
 * Assert that target contains one or more error messages (unsuccessful validation).
 * Mutates current chainable object to be list {String[]} of error messages.
 *
 * @example
 * expect(target).to.[not].have.errmsgs
 * target.should.[not].have.errmsgs
 * expect(target).to.[not].have.errmsgs.that.include(errmsg)
 * target.should.have.errmsgs.that.include(errmsg)
 */
var errmsgs = function errmsgs(utils) {
  var obj = this._obj,
      errmsgs = getErrmsgs(obj);
  this.assert(
      'array' === utils.type(errmsgs) && errmsgs.length > 0,
      'expected #{this} to have errmsgs',
      'expected #{this} to not have errmsgs'
  );
  utils.flag(this, 'object', errmsgs);
};

/**
 * @namespace method
 *
 * @description
 *
 * Chainable methods.
 *
 */

/**
 * Assert that target contains specified error message (unsuccessful validation).
 * @param {String} msg - errmsg to match
 * @example
 * target.should.[not].have.errmsg(msg)
 */
var errmsg = function errmsg(msg) {
  var obj = this._obj,
      errmsgs = getErrmsgs(obj);
  this.assert(
      _.contains(errmsgs, msg),
      'expected #{this} to have an error message: #{errmsg}',
      'expected #{this} to not an error message: #{errmsg}',
      msg,   // expected
      errmsgs   // actual
  );
};

//@formatter:off

var chai_joi=function (_chai, utils) { // plugin
  var Assertion = _chai.Assertion;

  // properties
  Assertion.addProperty('validation', validation                                   );
  Assertion.addProperty('validate',   validate                                     );
  Assertion.addProperty('value',      function () { _.bind(value, this)(utils);   });
  Assertion.addProperty('error',      function () { _.bind(error, this)(utils);   });
  Assertion.addProperty('errmsgs',    function () { _.bind(errmsgs, this)(utils); });

  // methods
  Assertion.addMethod('errmsg', errmsg);

  // raw assertions
  _chai.assert.isValidation = function (obj, msg) {
    //noinspection BadExpressionStatementJS
    new Assertion(obj, msg).is.a.validation;
  };

};

//@formatter:on

(function (plugin) {
  if (_.isFunction(require) && _.isObject(exports) && _.isObject(module)) { // node
    module.exports = plugin;
  }
  else if (_.isFunction(define) && define.amd) { // amd
    define(function () {
      return plugin;
    });
  }
  else { // other
    chai.use(plugin);
  }
}(chai_joi));
