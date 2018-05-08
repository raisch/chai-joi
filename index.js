/* Created by raisch on 4/16/15. */
const _ = require('lodash');
const chai = require('chai');
const { Assertion } = chai;

const FIELDS_TO_VALIDATE = ['error', 'value', 'then', 'catch'];

/**
 * @module chai-joi
 * @version 2.1.1
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
function getErrorMessages(result) {
  const details = _.get(result, 'error.details', []);
  return _.map(details, 'message');
};

/**
 * Asserts that the target object is result of a call to Joi.validate()
 * @param {object} target
 * @returns {boolean}
 */
function isValidation(obj, msg) {
  new Assertion(obj, msg).is.a.validation;
}

/**
 * Assert that target is a Joi validation
 * @example
 * expect(target).to.[not].be.a.validation
 * target.should.[not].be.a.validation
 */
function validation() {
  const target = this._obj;
  this.assert(_.isObject(target), '#{this} is not a Joi validation because it must be an object');
  this.assert(!_.isEmpty(target), '#{this} is not a Joi validation because it is an empty object');
  const fields = _.keys(target);
  const allFieldsPresent = _.every(FIELDS_TO_VALIDATE.map(field => _.includes(fields, field)));

  this.assert(
    allFieldsPresent,
    `${this} is not a validation because it does not contain expected keys`
  );
};

/**
 * Assert that target validates correctly
 * @example
 * expect(target).should.[not].validate
 * target.should.[not].validate
 */
function validate() {
  const target = this._obj;

  isValidation(target);
  this.assert(_.has(target, 'error') && null === target.error,
      '#{this} should validate but does not because '+getErrorMessages(target),
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
function error(utils) {
  const target = this._obj;
  isValidation(target);
  const error = target.error || null,
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
function value(utils) {
  const target = this._obj,
        value = target.value || null;
  isValidation(target);
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
function errmsgs(utils) {
  const obj = this._obj,
        errorMessages = getErrorMessages(obj);

  this.assert(
    _.isArray(errorMessages) && !_.isEmpty(errorMessages),
    'expected #{this} to have errmsgs',
    'expected #{this} to not have errmsgs'
  );
  utils.flag(this, 'object', errorMessages);
};

/**
 * Assert that target contains specified error message (unsuccessful validation).
 * @param {String} msg - errmsg to match
 * @example
 * target.should.[not].have.errmsg(msg)
 */
function errmsg(msg) {
  const obj = this._obj,
        errorMessages = getErrorMessages(obj);
  this.assert(
    _.includes(errorMessages, msg),
    'expected #{this} to have an error message: #{errmsg}',
    'expected #{this} to not an error message: #{errmsg}',
    msg,   // expected
    errorMessages   // actual
  );
};

function chaiJoi(_chai, utils) { // plugin
  // properties
  Assertion.addProperty('validation', validation);
  Assertion.addProperty('validate', validate);
  Assertion.addProperty('value', function () { _.bind(value, this)(utils); });
  Assertion.addProperty('error', function () { _.bind(error, this)(utils); });
  Assertion.addProperty('errmsgs',function () { _.bind(errmsgs, this)(utils); });

  // methods
  Assertion.addMethod('errmsg', errmsg);

  _chai.assert.isValidation = isValidation;
};

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
}(chaiJoi));
