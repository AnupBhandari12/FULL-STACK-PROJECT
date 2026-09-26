import { useState } from "react"

function PostCard({ post }) {
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)

  const baseLikes = post.reactions?.likes ?? 0

  const totalLikes = liked
    ? baseLikes + 1
    : baseLikes

  return (
    <div className="border p-4 rounded">
      <h2 className="text-xl font-bold">
        {post.title}
      </h2>

      <p className="mt-2">
        {post.body}
      </p>

      <div className="mt-4 flex gap-3">
        <button
          onClick={() =>
            setLiked((prev) => !prev)
          }
          className="border p-2 rounded"
        >
          {liked ? "❤️" : "🤍"} {totalLikes}
        </button>

        <button
          onClick={() =>
            setBookmarked((prev) => !prev)
          }
          className="border p-2 rounded"
        >
          {bookmarked
            ? "🔖 Saved"
            : "🔖 Bookmark"}
        </button>
      </div>
    </div>
  )
}

export default PostCard