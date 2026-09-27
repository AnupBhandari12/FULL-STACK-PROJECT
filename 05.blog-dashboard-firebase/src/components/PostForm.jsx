import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

import { db } from "../firebase/firebase";

function PostForm({ user }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setMessage("Title and content are required");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "posts"), {
        title: title.trim(),
        content: content.trim(),
        status: "draft",
        authorId: user.uid,
        createdAt: serverTimestamp(),
      });

      console.log("Created post:", docRef.id);

      setTitle("");
      setContent("");
      setMessage("Post created successfully");
    } catch (error) {
      console.log(error);
      setMessage("Failed to create post");
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold">Create Post</h2>

      <form onSubmit={handleSubmit} className="mt-4">
        <input
          type="text"
          placeholder="Post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded block mb-3"
        />

        <textarea
          placeholder="Write your post..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border p-2 rounded block mb-3"
        />

        <button type="submit" className="border p-2 rounded">
          Create Post
        </button>
      </form>

      {message && <p className="mt-3">{message}</p>}
    </div>
  );
}

export default PostForm;
