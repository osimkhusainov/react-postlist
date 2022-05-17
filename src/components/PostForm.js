import React, { useState } from "react";
import MyInput from "./UI/input/MyInpot";
import MyButton from "./UI/button/MyButton";

const PostForm = ({ create }) => {
  const [post, setPost] = useState({ title: "", body: "" });

  const addNewPost = (e) => {
    e.preventDefault();
    const newPost = {
      ...post,
      id: Date.now(),
    };
    create(newPost);
    setPost({ title: "", body: "" });
  };

  return (
    <form onSubmit={addNewPost}>
      <MyInput
        value={post.title}
        onChange={(e) => setPost({ ...post, title: e.target.value })}
        type="text"
        placeholder="Name of post"
      />
      <MyInput
        value={post.body}
        type="text"
        onChange={(e) => setPost({ ...post, body: e.target.value })}
        placeholder="Describe of post"
      />
      <MyButton>Create post</MyButton>
    </form>
  );
};

export default PostForm;
