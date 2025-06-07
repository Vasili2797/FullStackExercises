const _ = require("lodash");
const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  let totalLikes = blogs.reduce(function (sum, order) {
    return sum + order.likes;
  }, 0);

  return totalLikes;
};

const favoriteBlog = (blogs) => {
  let total = 0;
  let blog = {};
  for (let i = 0; i < blogs.length; i++) {
    if (blogs[i].likes > total) {
      total = blogs[i].likes;
      blog = blogs[i];
    }
  }
  console.log(blog);
  return total;
};

const mostBlogs = (blogs) => {
  let mostBlogsWrittenUser = _.countBy(blogs, (blog) => blog.author);
  // console.log(mostBlogsWrittenUser);
  // let sortedList = _.sortBy(blogs);
  const keyValue = Object.keys(mostBlogsWrittenUser).map((key) => [
    key,
    mostBlogsWrittenUser[key],
  ]);
  keyValue.sort((a, b) => {
    return b[1] - a[1];
  });
  const result = {
    author: keyValue[0][0],
    blogs: keyValue[0][1],
  };

  return result;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
};
