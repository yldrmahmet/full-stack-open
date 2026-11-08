const { test, describe } = require('node:test')
const assert = require('node:assert')
const dummy = require('./for_testing').dummy

describe('dummy', () => {
  test('dummy returns one', () => {
    const blogs = []
    const result = dummy(blogs)
    assert.strictEqual(result, 1)
  })
})