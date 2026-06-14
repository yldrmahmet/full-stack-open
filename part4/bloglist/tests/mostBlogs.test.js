const { test,describe } = require('node:test')
const assert = require('node:assert')
const mostBlogs = require('../utils/list_helper').mostBlogs

describe('mostBlogs', () => {
  test('empty array',() => {
    const blogPosts = []
    assert.deepStrictEqual(mostBlogs(blogPosts), {})
  })
  test('returns the top author with blog count',() => {
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
      },
      {
        title: 'fso faq',
        author: 'fso team2',
        url: 'https://fullstackopen.com/en/faq',
        likes: 15,
      }
    ]

    assert.deepStrictEqual(mostBlogs(blogPosts), { author: 'fso team', blogs: 2 })

  })
})