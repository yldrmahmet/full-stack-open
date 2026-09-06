const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  const blogs = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(blogs.body.length, helper.initialBlogs.length)
})

test('blog is identified by a field named id', async () => {
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

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'fso new note',
    author: 'fso team',
    url: 'https://fullstackopen.com/en/about',
    likes: 30,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map((r) => r.title)
  assert(titles.includes('fso new note'))
})

test('if likes property is missing, it will default to the value 0', async () => {
  const newBlog = {
    title: 'blog but no like',
    author: 'fso team',
    url: 'https://fullstackopen.com/en/about',
  }

  const postResponse = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const addedBlog = blogsAtEnd.find((blog) => blog.id === postResponse.body.id)
  assert.strictEqual(addedBlog.likes, 0)
})

test('if title or url missing, respond is 400', async () => {
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
    .send(noTitleBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  await api
    .post('/api/blogs')
    .send(noUrlBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/)
})

test('succeeds with status code 204 if id is valid', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  const ids = blogsAtEnd.map((n) => n.id)
  assert(!ids.includes(blogToDelete.id))

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
})

test('succeeds with valid data when update of a note', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]
  const newBlog = {
    title: blogToUpdate.title,
    author: blogToUpdate.author,
    url: blogToUpdate.url,
    likes: blogToUpdate.likes + 1,
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  const updatedBlog = blogsAtEnd.find((blog) => blog.id === blogToUpdate.id)

  assert.strictEqual(updatedBlog.likes, newBlog.likes)
  assert.strictEqual(blogsAtStart.length, blogsAtEnd.length)
})

after(async () => {
  await mongoose.connection.close()
})
