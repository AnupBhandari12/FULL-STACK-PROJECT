# Social Feed with Infinite Scroll

A React social media feed that automatically loads more posts as the user scrolls.

This project focuses on pagination, infinite scrolling, Intersection Observer, duplicate prevention, retry handling, and local post interactions.

## Features

- Fetch posts from a public API
- Load posts in batches
- Infinite scrolling
- Intersection Observer API
- Loading state
- Error handling
- Retry failed requests
- Duplicate post prevention
- End-of-feed detection
- Like / Unlike posts
- Bookmark / Unbookmark posts
- Responsive feed layout

## Tech Stack

- React
- Vite
- JavaScript
- Tailwind CSS
- DummyJSON Posts API
- Browser Intersection Observer API
- Bun

## How It Works

The app initially loads the first batch of posts.

```text
App Loads
    ↓
Fetch First 10 Posts
    ↓
Render Feed
    ↓
User Scrolls Down
    ↓
IntersectionObserver Detects Bottom
    ↓
Fetch Next 10 Posts
    ↓
Append New Posts
    ↓
Repeat Until End of Feed


Pagination Logic
The API uses limit and skip.
Example:
limit=10&skip=0
→ Posts 1–10

limit=10&skip=10
→ Posts 11–20

limit=10&skip=20
→ Posts 21–30

The next skip value is calculated using:
const nextSkip = skipValue + data.posts.length

Duplicate Prevention
Before storing newly fetched posts, the app checks post IDs and removes duplicate items.
This prevents duplicate React keys and repeated posts when multiple requests happen close together.
Request Protection
A useRef value is used to prevent multiple API requests from running at the same time.
const isFetchingRef = useRef(false)

If a request is already running, another request is ignored until the first one finishes.
Infinite Scroll
The app uses the browser's native IntersectionObserver.
When the bottom loader becomes visible:
Bottom Loader Visible
        ↓
hasMore = true
        ↓
not loading
        ↓
no error
        ↓
Fetch Next Page

Error and Retry Handling
If the API request fails:
- An error message is displayed
- Automatic loading pauses
- A Retry button is displayed
- The same page can be requested again
- Existing posts are not duplicated
Like Feature
Each post maintains local like state.
Like
false → true
true → false

The displayed like count changes when the post is liked or unliked.
Bookmark Feature
Each post also maintains local bookmark state.
Bookmark
false → Saved
Saved → Bookmark

Project Structure
src/
├── components/
│   └── PostCard.jsx
├── App.jsx
├── index.css
└── main.jsx

Run Locally
Install dependencies:
bun install

Start the development server:
bun run dev

Run ESLint:
bun run lint

Create a production build:
bun run build

What I Learned
Through this project I practiced:
- React state management
- API fetching
- Async JavaScript
- Pagination using limit and skip
- useEffect
- useRef
- useCallback
- Intersection Observer API
- Infinite scrolling
- Preventing duplicate API requests
- Deduplicating arrays
- Loading and error states
- Retry logic
- Conditional rendering
- Local component state
- Like and bookmark interactions
Completion Checklist
- Initial posts load correctly
- Scrolling automatically loads more posts
- Each page loads only once
- Duplicate posts do not appear
- Failed requests show an error
- Retry works without duplicating posts
- Like and unlike work
- Bookmark and unbookmark work
- Feed stops after the last page
- ESLint passes
- Production build succeeds
Future Improvements
- Persist bookmarks in localStorage
- Persist likes
- User profiles
- Comments
- Share feature
- Skeleton loading UI
- Backend database
- Authentication