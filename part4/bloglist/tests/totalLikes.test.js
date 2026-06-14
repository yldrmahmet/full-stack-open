const { test, describe } = require('node:test')
const assert = require('node:assert')
const totalLikes = require('../utils/list_helper').totalLikes

describe('total likes', () => {
  test('one blog post', () => {
    const blogPost =[ {
      title: 'fso about',
      author: 'fso team',
      url: 'https://fullstackopen.com/en/about',
      likes: 20,
    }]

    assert.strictEqual(totalLikes(blogPost), 20)

  })

  test('two blog posts', () => {
    const blogPosts = [
      {
        title: 'fso about',
        author: 'fso team',
        url: 'https://fullstackopen.com/en/about',
        likes: 20,
      },
      {
        title: 'fso faq',
        author: 'fso team',
        url: 'https://fullstackopen.com/en/faq',
        likes: 15,
      }
    ]

    assert.strictEqual(totalLikes(blogPosts), 35)

  })
})