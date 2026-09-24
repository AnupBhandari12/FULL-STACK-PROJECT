function MovieDetails({ movie}){
    if(!movie){
        return null
    }

    return(
        <div className="border p-4 rounded mt-6">
            <h2 className="text-2xl font-bold">{movie.Title}</h2>
            <p>
                Year:{movie.Year}
            </p>
            <p>
                Genre : {movie.Genre}
            </p>
            <p>
                Actor: {movie.Actors}
            </p>
            <p>
                Actors : {movie.Director}
            </p>
            <p>IMDb Rating : {movie.imdbRating}</p>

            <p className="mt-2">
                {movie.Plot}
            </p>
        </div>
    )
}
export default MovieDetails