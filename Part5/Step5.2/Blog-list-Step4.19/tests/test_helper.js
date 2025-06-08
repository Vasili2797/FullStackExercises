const Blog = require("../models/blog");
const User = require("../models/user");

const initialBlogs = [
  {
    title: "First Blog",
    author: "Bobby",
    likes: 10,
  },
  {
    title: "Connecting to the right MongoDB database",
    author: "Billy",
    likes: 25,
  },
  {
    title: "Double Check of every API call with MongoDB",
    author: "new Author",
    likes: 25,
  },
];

const nonExistingId = async () => {
  const blog = new Blog({
    title: "nnonya",
    auhor: "no Author was provided",
  });
  await blog.save();
  await blog.deleteOne();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
};
