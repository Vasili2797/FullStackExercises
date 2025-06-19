import React from "react";
import "../index.css";

const BlogForm = ({
  title,
  author,
  url,
  setTitle,
  setAuthor,
  setUrl,
  addBlog,
}) => {
  return (
    <div>
      <h3>create a new blog</h3>
      <div className="input-container">
        <form onSubmit={addBlog}>
          <p>
            title:{" "}
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
          </p>
          <p>
            author:{" "}
            <input
              type="text"
              value={author}
              onChange={(e) => {
                setAuthor(e.target.value);
              }}
            />
          </p>
          <p>
            url:{" "}
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
              }}
            />
          </p>
          <div className="button-container">
            <button type="submit" className="btn">
              create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogForm;
