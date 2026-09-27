# Blog Dashboard with React + Firebase

A full-featured blog dashboard built with React and Firebase.

Users can register, log in, create blog posts, edit and delete their own posts, switch between draft and published status, search posts, and keep their data stored in Firestore.

## Features

- User Registration
- User Login
- User Logout
- Firebase Authentication
- Detect current logged-in user
- Persistent login session
- Create blog posts
- Read logged-in user's posts
- Real-time Firestore updates
- Edit posts
- Delete posts
- Draft / Published status
- Search posts by title or content
- Empty state handling
- Loading and error states
- Firestore security rules
- Per-user post ownership

## Tech Stack

- React
- Vite
- JavaScript
- Tailwind CSS
- Firebase Authentication
- Cloud Firestore
- Bun

## Project Flow

```text
Register / Login
      ↓
Firebase Authentication
      ↓
Authenticated User
      ↓
UID
      ↓
Blog Dashboard
      ↓
Create / Read / Edit / Delete Posts
      ↓
Cloud Firestore


# Blog Dashboard with React + Firebase

A full-featured blog dashboard built with React and Firebase.

Users can register, log in, create blog posts, edit and delete their own posts, switch between draft and published status, search posts, and keep their data stored in Firestore.

## Features

- User Registration
- User Login
- User Logout
- Firebase Authentication
- Detect current logged-in user
- Persistent login session
- Create blog posts
- Read logged-in user's posts
- Real-time Firestore updates
- Edit posts
- Delete posts
- Draft / Published status
- Search posts by title or content
- Empty state handling
- Loading and error states
- Firestore security rules
- Per-user post ownership

## Tech Stack

- React
- Vite
- JavaScript
- Tailwind CSS
- Firebase Authentication
- Cloud Firestore
- Bun

## Project Flow

```text
Register / Login
      ↓
Firebase Authentication
      ↓
Authenticated User
      ↓
UID
      ↓
Blog Dashboard
      ↓
Create / Read / Edit / Delete Posts
      ↓
Cloud Firestore

Authentication Flow
Firebase Authentication handles:
- Register
- Login
- Logout
- Current user session
After registration or login, Firebase provides a unique user ID:
user.uid

This UID is used to connect blog posts with their owner.
Example:
{
  title: "Learning Firebase",
  content: "Today I learned Firestore.",
  status: "draft",
  authorId: user.uid
}

Firestore Post Structure
Posts are stored inside the posts collection.
posts
 └── postId
      ├── title
      ├── content
      ├── status
      ├── authorId
      └── createdAt

Example document:
{
  title: "My First Blog",
  content: "Learning Firebase with React",
  status: "draft",
  authorId: "firebase-user-uid",
  createdAt: serverTimestamp()
}

CRUD Operations
Create
New posts are created using:
addDoc()

Read
Posts are loaded in real time using:
onSnapshot()

Only posts belonging to the logged-in user are queried.
where("authorId", "==", user.uid)

Update
Posts are edited using:
updateDoc()

Delete
Posts are removed using:
deleteDoc()

Real-Time Updates
The dashboard uses Firestore onSnapshot().
This means:
Create Post
↓
Firestore updates
↓
onSnapshot detects change
↓
React state updates
↓
UI updates automatically

No manual browser refresh is required.
Draft and Published Status
Each post has a status:
draft

or:
published

Users can switch between them:
Draft
↓
Publish
↓
Published
↓
Move to Draft

Search
Posts can be searched by:
- Title
- Content
Search is case-insensitive.
Example:
React
react
REACT

all match the same content.
Firestore Security
The application uses Firestore security rules so authenticated users can manage only their own posts.
Example:
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    match /posts/{postId} {

      allow create: if request.auth != null
                    && request.resource.data.authorId == request.auth.uid;

      allow read: if request.auth != null
                  && resource.data.authorId == request.auth.uid;

      allow update, delete: if request.auth != null
                            && resource.data.authorId == request.auth.uid;
    }
  }
}

Frontend filtering alone is not considered security.
Firestore rules enforce permissions at the database level.
Project Structure
src/
├── components/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── PostForm.jsx
│   └── PostList.jsx
│
├── firebase/
│   └── firebase.js
│
├── App.jsx
├── main.jsx
└── index.css

Environment Variables
Create a .env file in the project root:
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

Do not commit your .env file.
Add this to .gitignore:
.env

You can also provide a .env.example:
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

Installation
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
- Firebase project setup
- Firebase Authentication
- User registration
- User login and logout
- Authentication state tracking
- Working with user UID
- Cloud Firestore
- Firestore collections and documents
- Creating documents with addDoc
- Real-time data with onSnapshot
- Updating documents with updateDoc
- Deleting documents with deleteDoc
- Firestore queries
- Per-user data filtering
- Firestore security rules
- React state management
- useEffect
- Conditional rendering
- Controlled forms
- Search filtering
- CRUD application flow
Completion Checklist
- Register works
- Login works
- Logout works
- Login survives page refresh
- User can create posts
- User can view their own posts
- Posts update without page refresh
- User can edit posts
- User can delete posts
- Draft / Published toggle works
- Search works
- Firestore data persists after refresh
- Users cannot manage another user's posts
- ESLint passes
- Production build succeeds
Future Improvements
- Better UI design
- Email verification
- Password reset
- User profile
- Blog images
- Rich text editor
- Categories and tags
- Pagination
- Public published-blog page
- Deployment