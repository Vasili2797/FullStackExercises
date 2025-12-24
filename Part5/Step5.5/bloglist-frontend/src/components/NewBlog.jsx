import blogService from "../services/blogs";
import { useState} from "react";
import BlogForm from "./BlogForm";

const NewBlog=(props) => {
  const {setBlogs, setAddedNewBlogMessage, toggleRef } =props;

    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [url, setUrl] = useState("");

    const clearingForm = () => {
      setTitle("");
      setAuthor("");
      setUrl("");
    };


    const addBlog = async (e) => {
      e.preventDefault();
      const blogObject = {
        title,
        author,
        url,
        likes: 0,
      };

      try {
        const newBlog = await blogService.create(blogObject);
        setBlogs(prev=>prev.concat(newBlog));
        clearingForm();
        setAddedNewBlogMessage(
          `a new blog ${blogObject.title} by ${blogObject.author} added`
        );

        if (toggleRef?.current?.toggleVisibility) {
          toggleRef.current.toggleVisibility();
        }
        setTimeout(() => {
          setAddedNewBlogMessage("");
        }, 5000);
      } catch (error) {
        console.log("Error adding blog: ", error);
      }
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
        />
      </div>
    );
  };

export default NewBlog;
