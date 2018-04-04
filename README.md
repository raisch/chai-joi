# chai-joi

Extends Chai with Joi specific assertions.

[![npm version](https://badge.fury.io/js/chai-joi.svg)](http://badge.fury.io/js/chai-joi)
[![Build Status](https://travis-ci.org/raisch/chai-joi.svg?branch=master)](https://travis-ci.org/raisch/chai-joi)
[![Dependencies Status](https://david-dm.org/raisch/chai-joi.svg)](https://david-dm.org/raisch/chai-joi)
[![DevDependencies Status](https://david-dm.org/raisch/chai-joi/dev-status.svg)](https://david-dm.org/raisch/chai-joi#info=devDependencies)

**TL;DL**

Assuming that `result` is the result of a Joi validation:

- Assert-style
  - chai.assert.isValidation(result)
 
- BDD-style
  - result.should
    - [.not].be.a.validation
    - [.not].validate
    - [.not].have.an.error
    - [.not].have.a.value
    - [.not].have.errmsgs
    - [.not].have.errmsgs.that.include(str)
    - [.not].have.errmsg(str)
   
- TDD-style
  - expect(result).to
    - [.not].be.a.validation
    - [.not].validate
    - [.not].have.an.error
    - [.not].have.a.value
    - [.not].have.errmsgs
    - [.not].have.errmsgs.that.include(str)
    - [.not].have.errmsg(str)

(See test/chai-joi.js for uses.)

**Example:**
```js
var joi    = require('joi'),
    chai   = require('chai'),
    expect = chai.expect;

chai.should();

chai.use( require('chai-joi') );

var data={
  str:'foo',
  num: 100
};

var schema=joi.object({
  str:joi.string().allow(''),
  num:joi.number().min(1).max(10)
});

var result=joi.validate(data,schema);

result.should.not.validate;
result.should.have.errmsg('"value" must be less than or equal to 10');

data.num=1;
result=joi.validate(data,schema);

expect(result).to.validate;
expect(result).to.not.have.errmsgs; // same thing, really.
```

* * *


# assert

Extension to chai.assert to test for a valid Joi validation result.



* * *

### assert.isValidation(target) 

Asserts that the target object is result of a call to Joi.validate()

**Parameters**

**target**: `object`, Asserts that the target object is result of a call to Joi.validate()

**Returns**: `boolean`



# property

Chainable properties.



* * *

### property.validation() 

Assert that target is a Joi validation


**Example**:
```js
expect(target).to.[not].be.a.validation
target.should.[not].be.a.validation
```


### property.validate() 

Assert that target validates correctly


**Example**:
```js
expect(target).should.[not].validate
target.should.[not].validate
```


### property.error() 

Assert that target contains one or more errors (unsuccessful validation).
Mutates current chainable object to be target.error.


**Example**:
```js
expect(target).to.[not].have.an.error
target.should.[not].have.an.error
```


### property.value() 

Assert that target contains a value.
Mutates current chainable object to be target.value.


**Example**:
```js
expect(target).to.[not].have.a.value
target.should.[not].have.a.value
```


### property.errmsgs() 

Assert that target contains one or more error messages (unsuccessful validation).
Mutates current chainable object to be list {String[]} of error messages.


**Example**:
```js
expect(target).to.[not].have.errmsgs
target.should.[not].have.errmsgs
expect(target).to.[not].have.errmsgs.that.include(errmsg)
target.should.have.errmsgs.that.include(errmsg)
```



# method

Chainable methods.



* * *

### method.errmsg(msg) 

Assert that target contains specified error message (unsuccessful validation).

**Parameters**

**msg**: `String`, errmsg to match


**Example**:
```js
target.should.[not].have.errmsg(msg)
```



* * *










