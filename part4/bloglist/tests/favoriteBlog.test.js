const { test, describe } = require('node:test')
const assert = require('node:assert')
const favoriteBlog = require('../utils/list_helper').favoriteBlog

describe('favoriteBlog', () => {
  test('returns the blog with most likes',() => {
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

    const favorite = {
      title: 'fso about',
      author: 'fso team',
      url: 'https://fullstackopen.com/en/about',
      likes: 20,
    }

    assert.deepStrictEqual(favoriteBlog(blogPosts), favorite)
  })
})