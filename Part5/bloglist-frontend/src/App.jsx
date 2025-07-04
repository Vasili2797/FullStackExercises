import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [addedNewBlogMessage, setAddedNewBlogMessage] = useState("");

  const [user, setUser] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));

      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setErrorMessage("Wrong username or password");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const loginForm = () => {
    return (
      <form onSubmit={handleLogin}>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
        <div>
          password
          <input
            type="text"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    );
  };

  const addBlog = (e) => {
    e.preventDefault();

    const blogObject = {
      title: e.target[0].value,
      author: user.name,
      likes: 10,
    };

    blogService
      .create(blogObject)
      .then((returnedObject) => {
        setBlogs(blogs.concat(returnedObject));
        setNewBlog("");
      })
      .then(() => {
        setAddedNewBlogMessage(
          `a new blog ${blogObject.title} by ${blogObject.author} added`
        );
        setTimeout(() => {
          setAddedNewBlogMessage(null);
        }, 5000);
      });
  };

  const handleBlogChange = (e) => {
    setNewBlog(e.target.value);
  };

  const blogForm = () => {
    return (
      <form onSubmit={addBlog}>
        <input type="text" value={newBlog} onChange={handleBlogChange} />
        <button type="submit">save</button>
      </form>
    );
  };

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={errorMessage} />
        {loginForm()}
      </div>
    );
  }

  return (
    <div>
      <div>
        <p>
          {user.name} is logged-in
          <button
            style={{ marginLeft: "10px" }}
            onClick={() => {
              window.localStorage.clear();
              window.location.reload();
            }}
          >
            Log Out
          </button>
        </p>
        {blogForm()}
      </div>
      <h2>blogs</h2>
      <Notification message={addedNewBlogMessage} />
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
