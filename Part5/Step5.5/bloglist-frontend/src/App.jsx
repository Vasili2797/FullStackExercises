import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import NewBlog from "./components/NewBlog";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [loginVisible, setLoginVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [addedNewBlogMessage, setAddedNewBlogMessage] = useState("");
  const [user, setUser] = useState(null);

  const toggleFormRef = useRef();

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
      setErrorMessage(null);
    } catch (exception) {
      setErrorMessage("Wrong username or password");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleLogout=()=>{
    window.localStorage.removeItem("loggedBlogappUser");
    window.location.reload();
  }

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? "none" : "" };
    const showWhenVisible = { display: loginVisible ? "" : "none" };

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
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
            onClick={handleLogout}
          >
            Log Out
          </button>
        </p>
        <Togglable buttonLabel="create new blog" ref={toggleFormRef}>
          <NewBlog
            blogs={blogs}
            setBlogs={setBlogs}
            setAddedNewBlogMessage={setAddedNewBlogMessage}
            toggleRef={toggleFormRef}
          />
        </Togglable>
      </div>
      <h2>blogs</h2>
      <Notification message={addedNewBlogMessage} />
      {blogs.slice()
        .sort((a, b) => {
          return b.likes - a.likes;
        })
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            updateBlog={(updatedBlog) => {
              console.log(blog);

              setBlogs((prev)=>
                prev.map((b) =>
                  b.id === updatedBlog.id ? { ...updatedBlog } : b
                )
              );
            }}
            deleteBlog={(id) => {
              setBlogs((prevBlogs) => prevBlogs.filter((b) => b.id !== id));
            }}
          />
        ))}
    </div>
  );
};

export default App;
