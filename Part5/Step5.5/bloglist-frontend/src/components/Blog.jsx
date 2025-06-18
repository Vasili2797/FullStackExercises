import { useState } from "react";
import "../index.css";
import blogService from "../services/blogs";

const Blog = ({ blog, updateBlog, deleteBlog }) => {
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
        <div>
          Title: {blog.title}
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
        <div>Author: {blog.author}</div>
        <div>
          Likes: {blog.likes}
          <button
            className="btn"
            style={{ marginLeft: 10 }}
            onClick={async () => {
              const updated = {
                ...blog,
                likes: blog.likes + 1,
                user: blog.user.id || blog.user,
              };
              const updatedBlog = await blogService.update(blog.id, updated);
              updateBlog(updatedBlog);
            }}
          >
            like
          </button>
        </div>
        {blog.url && <div>URL: {blog.url}</div>}
        {blog.user || blog.user.name ? (
          <div>Added by: {blog.user.name}</div>
        ) : (
          <div>Added by: Unknown</div>
        )}
        <button
          className="btn"
          onClick={async () => {
            if (confirm("Do you want to delete?")) {
              const deletedItem = await blogService.remove(blog.id);
              deleteBlog(blog.id);
            }
          }}
        >
          Remove
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
