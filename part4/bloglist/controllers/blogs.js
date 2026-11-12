const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const userExtractor = require('../utils/middleware').userExtractor

// endpoints

// get all blogs
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username:1, name:1 })
  response.json(blogs)
})

// create one blog
blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

// delete one blog
blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  const user = request.user

  if(!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  if(blog.user && blog.user.toString() === user.id) {
    await Blog.findByIdAndDelete(request.params.id)
    const userBlog = user.blogs.filter(blogId => blogId.toString() !== blog.id)
    user.blogs = userBlog
    await user.save()
    response.status(204).end()
  } else {
    response.status(403).send({ error: 'operation not permitted' })
  }
})

// update one blog
blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body
  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).end()
  }
  blog.title = title
  blog.author = author
  blog.url = url
  blog.likes = likes

  const updatedBlog = await blog.save()
  response.json(updatedBlog)
})

module.exports = blogsRouter
