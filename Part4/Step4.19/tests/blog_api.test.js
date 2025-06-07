const bcrypt = require("bcrypt");
const User = require("../models/user");
const assert = require("node:assert");
const { test, after, beforeEach, describe } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./test_helper");
const Blog = require("../models/blog");
const config = require("../utils/config");

const api = supertest(app);

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

describe("When there is initially some blogs saved", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(helper.initialBlogs);
  });

  test("blogs are returned as json", async () => {
    console.log("Connected to MongoDB at", config.MONGODB_URI);
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");
    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });

  test("a specific blog is within the returned blogs", async () => {
    const response = await api.get("/api/blogs");

    const titles = response.body.map((e) => e.title);

    assert.ok(titles.includes("Double Check of every API call with MongoDB"));
  });

  describe("when there is initially one user in db", () => {
    beforeEach(async () => {
      await User.deleteMany({});

      const passwordHash = await bcrypt.hash("sekret", 10);
      const user = new User({
        username: "root",
        passwordHash,
      });
      await user.save();
    });

    test("creation succeeds with a fresh username", async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: "mluukkai",
        name: "Matti Luukkainen",
        password: "salainen",
      };

      await api
        .post("/api/users")
        .send(newUser)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const usersAtEnd = await helper.usersInDb();
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

      const usernames = usersAtEnd.map((u) => u.username);

      console.log(usernames);
      assert(usernames.includes(newUser.username));
    });

    test("creation fails with proper statuscode and message if username already taken", async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: "root",
        name: "Superuser",
        password: "salainen",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      // console.log(result);

      const usersAtEnd = await helper.usersInDb();
      assert(result.body.error.includes("expected `username` to be unique"));
      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });
  });

  describe("viewing a specific blog", () => {
    test("a specific blog can be viewed", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToView = blogsAtStart[0];

      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      assert.deepStrictEqual(resultBlog.body, blogToView);
    });

    test("fails with statuscode 404 if blog does not exist", async () => {
      const validNonExistingId = await helper.nonExistingId();
      await api.get(`/api/notes/${validNonExistingId}`).expect(404);
    });

    test("fails with statuscode 400 id is invalid", async () => {
      const invalidId = "5a124fsdq2dadasd2";
      await api.get(`/api/blogs/${invalidId}`).expect(400);
    });
  });

  describe("addition of a new blog", () => {
    test("a valid blog can be added ", async () => {
      const newBlog = {
        title: "New Blog is added from refactorings in Step 4.8",
        author: "Billy at 1:42",
        likes: 100,
      };

      await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      const addedBlog = blogsAtEnd.find(
        (blog) => blog.author === "Billy at 1:42"
      );

      assert.ok(addedBlog);
      assert.strictEqual(
        addedBlog.title,
        "New Blog is added from refactorings in Step 4.8"
      );
      assert.strictEqual(addedBlog.likes, 100);
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);
    });

    test("blog without the body will not be added", async () => {
      const newBlog = {
        title: "Blog with no author",
        likes: 0,
      };

      await api.post("/api/blogs").send(newBlog).expect(400);
      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
    });
  });

  describe("deletion of a blog", () => {
    test("succeeeds with status code 204 if id is valid", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToDelete = blogsAtStart[0];
      console.log(blogToDelete.id);
      //   683c15eab91a5c2b4e292cb2

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);
      const blogsAtEnd = await helper.blogsInDb();

      const contents = blogsAtEnd.map((n) => n.title);
      console.log(contents);

      assert(!contents.includes(blogToDelete.title));

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);
    });
  });

  describe("Updating of a blog", () => {
    test("succeeds with updating the blog", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToUpdate = blogsAtStart[0];
      console.log(blogToUpdate.likes);
      const body = {
        title: blogToUpdate.title,
        author: blogToUpdate.author,
        likes: blogToUpdate.likes + 30,
      };

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(body)
        .expect(200)
        .expect("Content-Type", /application\/json/);
      const blogsAtEnd = await helper.blogsInDb();
      const updatedBlog = blogsAtEnd.find(
        (blog) => blog.id === blogToUpdate.id
      );
      assert.strictEqual(updatedBlog.likes, blogToUpdate.likes + 30);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
