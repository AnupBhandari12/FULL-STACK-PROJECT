import { useState } from "react"

function MovieCard({ movie , onSelect }) {
  const [imageError, setImageError] = useState(false)

  const hasPoster =
    movie.Poster &&
    movie.Poster !== "N/A" &&
    !imageError

  return (
    <div className="border p-3 rounded cursor-pointer" 
    onClick={() => onSelect(movie.imdbID)}>

      {hasPoster ? (
        <img
          src={movie.Poster}
          alt={movie.Title}
          className="w-full h-64 object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full h-64 border flex items-center justify-center">
          No Poster
        </div>
      )}

      <h2 className="font-bold mt-2">
        {movie.Title}
      </h2>

      <p>{movie.Year}</p>

    </div>
  )
}

export default MovieCard