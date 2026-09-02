const Blog = require('../models/blog')

const initialBlogs = [
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

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = { initialBlogs, blogsInDb }