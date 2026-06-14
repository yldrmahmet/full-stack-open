const dummy = (blogs) => 1

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => {
    return sum + blog.likes
  },0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((favorite, blog) => {
    if(blog.likes > favorite.likes) return blog
    return favorite
  })
}

// The function returns the author who has the largest amount of blogs
const mostBlogs = (blogs) => {

  if(blogs.length < 1) return {}

  const counts = blogs.reduce((counts, blog) => {
    if(counts[blog.author]) counts[blog.author]+=1
    else counts[blog.author] = 1
    return counts
  }, {})

  const best =  Object.entries(counts).reduce((best,author) => {
    if(author[1] > best[1]) return author
    return best
  })

  return { author: best[0], blogs: best[1] }
}

const mostLikes = (blogs) => {

  if(blogs.length < 1) return {}

  const counts = blogs.reduce((counts, blog) => {
    if(counts[blog.author]) counts[blog.author]+=blog.likes
    else counts[blog.author] = blog.likes
    return counts
  }, {})

  const best = Object.entries(counts).reduce((best,author) => {
    if(author[1] > best[1]) return author
    return best
  })

  return { author: best[0], likes: best[1] }

}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }