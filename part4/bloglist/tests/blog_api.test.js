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
  assert(blog.id)
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

after(async () => {
  await mongoose.connection.close()
})
