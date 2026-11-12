const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)

let token
const newBlog = {
  title: 'fso new note',
  author: 'fso team',
  url: 'https://fullstackopen.com/en/about',
  likes: 30,
}

beforeEach(async () => {
  await Blog.deleteMany({})
  await helper.resetUsersWithRoot()
  await Blog.insertMany(helper.initialBlogs)

  const response = await api
    .post('/api/login')
    .send({ username: 'root', password: 'sekret' })
    .expect(200)
    .expect('Content-Type', /application\/json/)
  token = response.body.token
})

describe('GET /api/blogs', () => {
  test('returns all blogs as JSON', async () => {
    const blogs = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(blogs.body.length, helper.initialBlogs.length)
  })

  test('uses id instead of _id', async () => {
    const blogs = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const blog = blogs.body[0]

    // blog must have an id
    assert(blog.id)

    // blog must not have _id because toJSON renames _id to id
    assert(!blog._id)
  })
})

describe('POST /api/blogs', () => {
  test('creates a new blog', async () => {
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map((r) => r.title)
    assert(titles.includes('fso new note'))
  })

  test('sets likes to 0 if missing', async () => {
    const noLikeBlog = {
      title: 'blog but no like',
      author: 'fso team',
      url: 'https://fullstackopen.com/en/about',
    }

    const postResponse = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(noLikeBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const addedBlog = blogsAtEnd.find((blog) => blog.id === postResponse.body.id)
    assert.strictEqual(addedBlog.likes, 0)
  })

  test('fails with 400 if title or url is missing', async () => {
    const noTitleBlog = {
      author: 'fso team',
      url: 'https://fullstackopen.com/en/about',
      likes: 40,
    }

    const noUrlBlog = {
      title: 'blog with no url',
      author: 'fso team',
      likes: 20,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(noTitleBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(noUrlBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('fails with 401 if token is missing', async () => {
    const result = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    assert.strictEqual(result.body.error, 'token invalid')
  })
})

describe('DELETE /api/blogs/:id', () => {
  let ownBlog

  beforeEach(async () => {
    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    ownBlog = response.body
  })

  test('deletes the blog and returns 204', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const usersAtStart = await helper.usersInDb()
    const userAtStart = usersAtStart.find(user => user.username === 'root')

    await api
      .delete(`/api/blogs/${ownBlog.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    const usersAtEnd = await helper.usersInDb()
    const userAtEnd = usersAtEnd.find(user => user.username === 'root')

    const ids = blogsAtEnd.map((blog) => blog.id)
    assert(!ids.includes(ownBlog.id))

    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
    assert.strictEqual(userAtEnd.blogs.length, userAtStart.blogs.length - 1)
  })

  test('fails with 401 if token is missing', async () => {
    const result = await api
      .delete(`/api/blogs/${ownBlog.id}`)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    assert.strictEqual(result.body.error, 'token invalid')
  })

  test('fails with 403 if not the owner', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart.find(blog => blog.id !== ownBlog.id)

    const result = await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(403)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    assert.strictEqual(result.body.error, 'operation not permitted')
  })
})

describe('PUT /api/blogs/:id', () => {
  test('updates the likes of a blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const blogWithUpdate = {
      title: blogToUpdate.title,
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes: blogToUpdate.likes + 1,
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogWithUpdate)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlog = blogsAtEnd.find((blog) => blog.id === blogToUpdate.id)

    assert.strictEqual(updatedBlog.likes, blogWithUpdate.likes)
    assert.strictEqual(blogsAtStart.length, blogsAtEnd.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})
