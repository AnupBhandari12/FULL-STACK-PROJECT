import { useEffect, useState } from "react";

import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

function PostList({ user }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  // Read logged-in user's posts in real time
  useEffect(() => {
    const postsRef = collection(db, "posts");

    const q = query(postsRef, where("authorId", "==", user.uid));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const postData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPosts(postData);
        setLoading(false);
        setError("");
      },

      (error) => {
        console.log(error);

        setError("Failed to load posts");
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [user.uid]);

  // Delete post
  const handleDelete = async (postId) => {
    try {
      const postRef = doc(db, "posts", postId);

      await deleteDoc(postRef);
    } catch (error) {
      console.log(error);
    }
  };

  // Start editing
  const handleEdit = (post) => {
    setEditingId(post.id);
    setEditTitle(post.title);
    setEditContent(post.content);
  };

  // Save edited post
  const handleUpdate = async (postId) => {
    if (!editTitle.trim() || !editContent.trim()) {
      return;
    }

    try {
      const postRef = doc(db, "posts", postId);

      await updateDoc(postRef, {
        title: editTitle.trim(),
        content: editContent.trim(),
      });

      setEditingId(null);
      setEditTitle("");
      setEditContent("");
    } catch (error) {
      console.log(error);
    }
  };

  // Draft <-> Published
  const handleStatusToggle = async (post) => {
    try {
      const postRef = doc(db, "posts", post.id);

      const newStatus = post.status === "draft" ? "published" : "draft";

      await updateDoc(postRef, {
        status: newStatus,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Search posts
  const filteredPosts = posts.filter((post) => {
    const term = searchTerm.trim().toLowerCase();

    const title = post.title?.toLowerCase() ?? "";

    const content = post.content?.toLowerCase() ?? "";

    return title.includes(term) || content.includes(term);
  });

  if (loading) {
    return <p className="mt-6">Loading posts...</p>;
  }

  if (error) {
    return <p className="mt-6">{error}</p>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold">My Posts</h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search posts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 rounded mt-4 w-full"
      />

      {/* No posts */}
      {posts.length === 0 && <p className="mt-4">No posts yet</p>}

      {/* Search has no results */}
      {posts.length > 0 && filteredPosts.length === 0 && (
        <p className="mt-4">No matching posts found</p>
      )}

      {/* Posts */}
      {filteredPosts.map((post) => (
        <div key={post.id} className="border p-4 rounded mt-4">
          {editingId === post.id ? (
            <div>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="border p-2 rounded block mb-2 w-full"
              />

              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="border p-2 rounded block mb-2 w-full"
              />

              <button
                onClick={() => handleUpdate(post.id)}
                className="border p-2 rounded mr-2"
              >
                Save
              </button>

              <button
                onClick={() => {
                  setEditingId(null);
                  setEditTitle("");
                  setEditContent("");
                }}
                className="border p-2 rounded"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <h3 className="text-lg font-bold">{post.title}</h3>

              <p className="mt-2">{post.content}</p>

              <p className="mt-2 text-sm">Status: {post.status}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => handleStatusToggle(post)}
                  className="border p-2 rounded"
                >
                  {post.status === "draft" ? "Publish" : "Move to Draft"}
                </button>

                <button
                  onClick={() => handleEdit(post)}
                  className="border p-2 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(post.id)}
                  className="border p-2 rounded"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default PostList;
