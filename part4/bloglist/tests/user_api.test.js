const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await helper.resetUsersWithRoot()
})

describe('POST /api/users', () => {
  test('fails with 400 if username is too short', async () => {
    const usersAtStart = await helper.usersInDb()
    const userWithShortUsername = {
      username: 'aa', password: '12345'
    }

    const result = await api
      .post('/api/users/')
      .send(userWithShortUsername)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    const newUser = usersAtEnd.find(user => user.username === 'aa')
    assert(!newUser)
    assert(result.body.error.includes('User validation failed: username: Path `username`'))
    assert(result.body.error.includes('is shorter than the minimum allowed length'))
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('fails with 400 if username is taken', async () => {
    const usersAtStart = await helper.usersInDb()
    const userWithSameUsername = {
      username: 'root', password: '12345'
    }

    const result = await api
      .post('/api/users/')
      .send(userWithSameUsername)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    const rootUsers = usersAtEnd.filter(user => user.username === 'root')
    assert.strictEqual(rootUsers.length, 1)
    assert(result.body.error.includes('expected `username` to be unique'))
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('fails with 400 if username is missing', async () => {
    const usersAtStart = await helper.usersInDb()
    const userWithNoUsername = {
      name: 'ahmet yildirim',
      password: '12345'
    }

    const result = await api
      .post('/api/users/')
      .send(userWithNoUsername)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    const newUser = usersAtEnd.find(user => user.name === 'ahmet yildirim')
    assert(!newUser)
    assert(result.body.error.includes('User validation failed: username: Path `username` is required.'))
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('fails with 400 if password is too short', async () => {
    const usersAtStart = await helper.usersInDb()
    const userWithShortPassword = {
      username: 'ahmet', password: '12'
    }

    const result = await api
      .post('/api/users/')
      .send(userWithShortPassword)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    const newUser = usersAtEnd.find(user => user.username === 'ahmet')
    assert(!newUser)
    assert(result.body.error.includes('password must be at least 3 characters long'))
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('fails with 400 if password is missing', async () => {
    const usersAtStart = await helper.usersInDb()
    const userWithNoPassword = {
      username: 'ahmet'
    }

    const result = await api
      .post('/api/users/')
      .send(userWithNoPassword)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    const newUser = usersAtEnd.find(user => user.username === 'ahmet')
    assert(!newUser)
    assert(result.body.error.includes('password is required'))
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})
