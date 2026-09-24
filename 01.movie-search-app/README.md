# Movie Search App

A React movie search application built using the OMDb API.

## Features

- Search movies by title
- Automatic search with debounce
- Movie poster, title and year
- Full movie details
- IMDb rating, genre, actors, director and plot
- Loading state
- Error handling
- No-results handling
- Broken poster fallback
- Responsive movie grid

## Tech Stack

- React
- Vite
- JavaScript
- Tailwind CSS
- OMDb API
- Bun

## Run Locally

Clone the project:

```bash
git clone YOUR_REPOSITORY_URL


Install dependencies:

bun install

Create a .env file:

VITE_OMDB_API_KEY=your_api_key

Run the development server:

bun run dev
Environment Variables

Get an API key from OMDb and add:
env:
VITE_OMDB_API_KEY=your_api_key



What I Learned
React useState
React useEffect
useCallback
Props and reusable components
API fetching
Async/await
Debouncing
Loading and error states
Conditional rendering
Responsive Tailwind grid
Environment variables