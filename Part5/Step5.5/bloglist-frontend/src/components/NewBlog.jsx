import blogService from "../services/blogs";
import { useState, forwardRef, useImperativeHandle } from "react";
import BlogForm from "./BlogForm";

const NewBlog = forwardRef(
  ({ blogs, setBlogs, setAddedNewBlogMessage, toggleRef }, ref) => {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [url, setUrl] = useState("");

    useImperativeHandle(ref, () => ({
      clearForm() {
        setTitle("");
        setAuthor("");
        setUrl("");
      },
    }));

    const addBlog = async (e) => {
      e.preventDefault();
      const blogObject = {
        title: title,
        author: author,
        url: url,
        likes: "0",
      };

      try {
        const newBlog = await blogService.create(blogObject);
        setBlogs(blogs.concat(newBlog));
        setTitle("");
        setAuthor("");
        setUrl("");
        setAddedNewBlogMessage(
          `a new blog ${blogObject.title} by ${blogObject.author} added`
        );

        if (toggleRef?.current?.toggleVisibility) {
          toggleRef.current.toggleVisibility();
        }
        setTimeout(() => {
          setAddedNewBlogMessage("");
          console.log(newBlog);
        }, 5000);
      } catch (error) {
        console.log("Error adding blog: ", error);
      }
    };

    const clearingForm = () => {
      setTitle("");
      setAuthor("");
      setUrl("");
    };

    return (
      <div>
        <BlogForm
          title={title}
          author={author}
          url={url}
          setTitle={setTitle}
          setAuthor={setAuthor}
          setUrl={setUrl}
          addBlog={addBlog}
          setVisible={ref}
          onClick={clearingForm}
        />
      </div>
    );
  }
);

export default NewBlog;
