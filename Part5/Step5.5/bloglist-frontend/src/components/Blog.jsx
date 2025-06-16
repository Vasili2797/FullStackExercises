import { useState } from "react";
import "../index.css";
import blogService from "../services/blogs";

const Blog = ({ blog, updateBlog }) => {
  const [view, setView] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  if (view) {
    return (
      <div style={blogStyle}>
        <div>Title: {blog.title}</div>
        <div>Author: {blog.author}</div>
        <div>
          Likes: {blog.likes}
          <button
            style={{ marginLeft: 10 }}
            onClick={async () => {
              const updated = { ...blog, likes: blog.likes + 1 };
              const updatedBlog = await blogService.update(blog.id, updated);
              updateBlog(updatedBlog);
            }}
          >
            like
          </button>
        </div>
        {blog.url && <div>URL: {blog.url}</div>}
        <button
          className="btn"
          style={{ marginTop: 5 }}
          onClick={() => {
            setView(!view);
          }}
        >
          hide
        </button>
      </div>
    );
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button
          className="btn"
          onClick={() => {
            setView(!view);
          }}
        >
          view
        </button>
      </div>
    </div>
  );
};
export default Blog;
