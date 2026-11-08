const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

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

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const resetUsersWithRoot = async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })

  await user.save()
}

module.exports = { initialBlogs, blogsInDb, usersInDb, resetUsersWithRoot }
