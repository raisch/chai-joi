# chai-joi
Chai extensions for Joi validations.

### NOTE: In development, not yet useful.

* * *

# methods

* * *

### errmsg(msg)

Assert that target contains specified error message (unsuccessful validation).

**Parameters**

**msg**: `String`, Assert that target contains specified error message (unsuccessful validation).


**Example**:
```js
target.should.[not].have.errmsg(msg)
```

# properties

* * *

### validationResult

Assert that target is a result of a Joi.validate

**Example**:
```js
expect(target).to.[not].be.a.validationResult
target.should.[not].be.a.validationResult
assert.validationResult(target)
```

### validate

Assert that target validates correctly

**Example**:
```js
expect(target).to.[not].validate
target.should.[not].validate
assert.validate(target)
```

### error

Assert that target contains one or more errors (unsuccessful validation).
Mutates current chainable object to be target.error.

**Example**:
```js
expect(target).to.[not].have.error
target.should.[not].have.error
assert.error(target)
```

### value

Assert that target contains a value.
Mutates current chainable object to be target.error.

**Example**:
```js
expect(target).to.[not].have.value
target.should.[not].have.value
assert.value(target)
```

### errmsgs

Assert that target contains one or more error messages (unsuccessful validation).
Mutates current chainable object to be list {String[]} of error messages.

**Example**:
```js
expect(target).to.[not].have.errmsgs
target.should.[not].have.errmsgs
assert.errmsgs(target)
target.should.have.errmsgs.that.contain(errmsg)
```

* * *
