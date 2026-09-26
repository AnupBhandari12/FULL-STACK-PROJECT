import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"

import PostCard from "./components/PostCard"

const LIMIT = 10

function App() {
  const [posts, setPosts] = useState([])
  const [skip, setSkip] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [hasMore, setHasMore] = useState(true)

  const loaderRef = useRef(null)
  const isFetchingRef = useRef(false)

  // Initial posts load
  useEffect(() => {
    let cancelled = false

    const loadInitialPosts = async () => {
      try {
        const response = await fetch(
          `https://dummyjson.com/posts?limit=${LIMIT}&skip=0`
        )

        if (!response.ok) {
          throw new Error("Failed to fetch posts")
        }

        const data = await response.json()

        if (cancelled) {
          return
        }

        setPosts(data.posts)

        const nextSkip = data.posts.length

        setSkip(nextSkip)
        setHasMore(nextSkip < data.total)
        setError("")
      } catch (error) {
        console.log(error)

        if (!cancelled) {
          setError("Something went wrong")
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadInitialPosts()

    return () => {
      cancelled = true
    }
  }, [])

  // Load next page
  const loadMorePosts = useCallback(
    async (skipValue) => {
      if (isFetchingRef.current) {
        return
      }

      try {
        isFetchingRef.current = true

        const response = await fetch(
          `https://dummyjson.com/posts?limit=${LIMIT}&skip=${skipValue}`
        )

        if (!response.ok) {
          throw new Error("Failed to fetch posts")
        }

        const data = await response.json()

        setPosts((prev) => {
          const combinedPosts = [
            ...prev,
            ...data.posts,
          ]

          const uniquePosts = combinedPosts.filter(
            (post, index, array) =>
              index ===
              array.findIndex(
                (item) => item.id === post.id
              )
          )

          return uniquePosts
        })

        const nextSkip =
          skipValue + data.posts.length

        setSkip(nextSkip)
        setHasMore(nextSkip < data.total)
        setError("")
      } catch (error) {
        console.log(error)
        setError("Something went wrong")
      } finally {
        setLoading(false)
        isFetchingRef.current = false
      }
    },
    []
  )

  // Infinite scroll
  useEffect(() => {
    const currentLoader = loaderRef.current

    if (!currentLoader) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0]

        if (
          target.isIntersecting &&
          hasMore &&
          !loading &&
          !error &&
          !isFetchingRef.current
        ) {
          setLoading(true)
          loadMorePosts(skip)
        }
      },
      {
        threshold: 1,
      }
    )

    observer.observe(currentLoader)

    return () => {
      observer.disconnect()
    }
  }, [
    skip,
    hasMore,
    loading,
    error,
    loadMorePosts,
  ])

  const handleRetry = () => {
    setLoading(true)
    setError("")

    loadMorePosts(skip)
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold">
        Social Feed
      </h1>

      <div className="mt-6 space-y-4">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
          />
        ))}
      </div>

      {error && (
        <div className="mt-4">
          <p>{error}</p>

          <button
            onClick={handleRetry}
            className="border p-2 rounded mt-2"
          >
            Retry
          </button>
        </div>
      )}

      {hasMore && !error && (
        <div
          ref={loaderRef}
          className="mt-6"
        >
          {loading
            ? "Loading more posts..."
            : "Scroll for more"}
        </div>
      )}

      {!hasMore && (
        <p className="mt-6">
          No more posts
        </p>
      )}
    </div>
  )
}

export default App