const { test, describe } = require('node:test')
const assert = require('node:assert')
const mostLikes = require('../utils/list_helper').mostLikes

describe('mostLikes', () => {
  test('empty array', () => {
    assert.deepStrictEqual(mostLikes([]), {})
  })
  test('return the top author with likes count', () => {
    const testBlogs = [
      {
        title: 'fso about',
        author: 'fso team',
        url: 'https://fullstackopen.com/en/about',
        likes: 20,
      },
      {
        title: 'fso faq',
        author: 'fso team1',
        url: 'https://fullstackopen.com/en/faq',
        likes: 15,
      },{
        title: 'fso about',
        author: 'fso team2',
        url: 'https://fullstackopen.com/en/about',
        likes: 20,
      },{
        title: 'fso about',
        author: 'fso team1',
        url: 'https://fullstackopen.com/en/about',
        likes: 20,
      },{
        title: 'fso about',
        author: 'fso team',
        url: 'https://fullstackopen.com/en/about',
        likes: 20,
      },
    ]
    assert.deepStrictEqual(mostLikes(testBlogs), { author: 'fso team', likes: 40 })
  })
})