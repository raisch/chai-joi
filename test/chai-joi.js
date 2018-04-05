'use strict'
/* eslint-env node, es6 */

const util = require('util')
const _ = require('lodash')
const joi = require('joi')
const chai = require('chai')
const assert = chai.assert
const expect = chai.expect

chai.should()

chai.use(require('../index'))

const ValidationError = (msg) => {
  this.name = 'ValidationError'
  this.message = msg
}
ValidationError.prototype = Object.create(Error.prototype)
ValidationError.prototype.constructor = ValidationError

describe('assertions', function () {
  it('should correctly identify Joi validations', function () {
    const result = joi.validate('1', joi.string())
    console.log(JSON.stringify(result))
    assert.isValidation(result)
  })

  it('should not identify a non-object as a validation', function () {
    var result
    try {
      result = assert.isValidation(null)
    } catch (e) {
      if (e instanceof chai.AssertionError && e.toString().match(/must be an object$/)) {
        return
      }
      throw e
    }
    throw new Error('unexpected success: ' + util.inspect(result))
  })

  it('should not identify an empty object as a validation', function () {
    var result
    try {
      result = assert.isValidation({})
    } catch (e) {
      if (e instanceof chai.AssertionError && e.toString().match(/empty object$/)) {
        return
      }
      throw e
    }
    throw new Error('unexpected success: ' + util.inspect(result))
  })

  it('should not identify an object with a missing field as a validation', function () {
    var result
    try {
      result = assert.isValidation({error: 1})
    } catch (e) {
      if (e instanceof chai.AssertionError && e.toString().match(/required keys$/)) {
        return
      }
      throw e
    }
    throw new Error('unexpected success: ' + util.inspect(result))
  })

  it('should not identify an object with extra fields as a validation', function () {
    var result
    try {
      result = assert.isValidation({
        error: null,
        value: null,
        foo: null
      })
    } catch (e) {
      if (e instanceof chai.AssertionError && e.toString().match(/unexpected keys$/)) {
        return
      }
      throw e
    }
    throw new Error('unexpected success: ' + util.inspect(result))
  })
})

describe('properties', function () {
  describe('validation', function () {
    it('should identify a validation using expect', function () {
      expect(joi.validate('a', joi.string())).to.be.a.validation
    })

    it('should identify a validation using should', function () {
      joi.validate('a', joi.string()).should.be.a.validation
    })
  })

  describe('validate', function () {
    it('should validate using expect', function () {
      expect(joi.validate('a', joi.string())).to.validate
    })

    it('should not validate using expect', function () {
      expect(joi.validate(1, joi.string())).to.not.validate
    })

    it('should validate using should', function () {
      joi.validate('a', joi.string()).should.validate
    })

    it('should not validate using should', function () {
      joi.validate(1, joi.string()).should.not.validate
    })

    it('should provide the correct error message for an incorrect type', function () {
      var target = {a: 1}
      try {
        expect(joi.validate(target, joi.object({a: joi.string()}))).to.validate
      } catch (e) {
        if (e instanceof chai.AssertionError && e.toString().match(/"a" must be a string$/)) {
          return
        }
        throw e
      }
    })

    it('should provide the correct error message for an missing required field', function () {
      var target = {a: '1'}
      try {
        expect(joi.validate(target, joi.object({
          a: joi.string(),
          b: joi.string().required()
        }))).to.validate
      } catch (e) {
        if (e instanceof chai.AssertionError && e.toString().match(/"b" is required$/)) {
          return
        }
        throw e
      }
    })
  })

  describe('error', function () {
    it('should validate using expect', function () {
      expect(joi.validate('a', joi.string())).to.not.have.an.error
    })

    it('+++ should have the correct error using expect', function () {
      var result = joi.validate(1, joi.string())

      var error = _.get(result, 'error')
      expect(error).to.be.an('error')
      expect(error).to.have.property('name', 'ValidationError')

      var details = _.get(error, 'details')
      expect(details).to.be.an('array')

      var message = _.get(details, '0.message')
      expect(message).to.be.a('string')
      expect(message).to.equal('"value" must be a string')

      // var details = _.get(result, 'error.details');
      // console.log(JSON.stringify(result.error.details));

      // expect(result).to.have.error.with.property('name','ValidationError');
      // expect(result.error).to.have.error.with.deep.property('details[0].message','"value" must be a string');
    })

    it('should not validate using expect', function () {
      expect(joi.validate(1, joi.string())).to.have.an.error
    })

    it('should validate using should', function () {
      joi.validate('a', joi.string()).should.not.have.an.error
    })

    it('should have the correct error using should', function () {
      var result = joi.validate(1, joi.string())
      result.should.have.error.with.property('name', 'ValidationError')
      result.should.have.error.with.deep.property('details[0].message', '"value" must be a string')
    })

    it('should not validate using should', function () {
      joi.validate(1, joi.string()).should.have.an.error
    })
  })

  describe('value', function () {
    it('should validate using expect', function () {
      expect(joi.validate('a', joi.string())).to.have.a.value
    })

    it('should have the correct value using expect', function () {
      expect(joi.validate('a', joi.string())).to.have.a.value.equal('a')
    })

    it('should not have an incorrect value using expect', function () {
      expect(joi.validate('a', joi.string())).to.have.a.value.not.equal('b')
    })

    it('should validate using should', function () {
      joi.validate('a', joi.string()).should.have.a.value
    })

    it('should have the correct value using should', function () {
      joi.validate('a', joi.string()).should.have.a.value.equal('a')
    })

    it('should not have an incorrect value using should', function () {
      joi.validate('a', joi.string()).should.have.a.value.not.equal('b')
    })
  })

  describe('errmsgs', function () {
    var result

    beforeEach(function () {
      var data = {str: 1, num: ''},
        schema = joi.object({str: joi.string(), num: joi.number()})
      result = joi.validate(data, schema, {abortEarly: false})
    })

    it('should have errmsgs using expect', function () {
      expect(joi.validate(1, joi.string())).to.have.errmsgs
    })

    it('should not have errmsgs using expect', function () {
      expect(joi.validate(1, joi.number())).to.not.have.errmsgs
    })

    it('should have the right number of errmsgs using expect', function () {
      expect(result).to.have.errmsgs.length(2)
    })

    it('should have the right errmsgs using expect', function () {
      expect(result).to.have.errmsgs.that.include('"str" must be a string')
      expect(result).to.have.errmsgs.that.include('"num" must be a number')
    })

    it('should not have the wrong errmsgs using expect', function () {
      expect(result).to.have.errmsgs.that.not.include('wtf?')
    })

    it('should have errmsgs using should', function () {
      joi.validate(1, joi.string()).should.have.errmsgs
    })

    it('should not have errmsgs using should', function () {
      joi.validate(1, joi.number()).should.not.have.errmsgs
    })

    it('should have the right number of errmsgs using should', function () {
      result.should.have.errmsgs.length(2)
    })

    it('should have the right errmsgs using should', function () {
      result.should.have.errmsgs.that.include('"str" must be a string')
      result.should.have.errmsgs.that.include('"num" must be a number')
    })

    it('should not have the wrong errmsgs using should', function () {
      result.should.have.errmsgs.that.not.include('wtf?')
    })
  })

  describe('errmsg', function () {
    var result

    beforeEach(function () {
      var data = {str: 1, num: ''},
        schema = joi.object({str: joi.string(), num: joi.number()})
      result = joi.validate(data, schema, {abortEarly: false})
    })

    it('should have the right errmsgs using expect', function () {
      expect(result).to.have.errmsg('"str" must be a string')
      expect(result).to.have.errmsg('"num" must be a number')
    })

    it('should not have the wrong errmsgs using expect', function () {
      expect(result).to.not.have.errmsg('wtf?')
    })

    it('should have the right errmsgs using should', function () {
      result.should.have.errmsg('"str" must be a string')
      result.should.have.errmsg('"num" must be a number')
    })

    it('should not have the wrong errmsgs using should', function () {
      result.should.not.have.errmsg('wtf?')
    })
  })
})
