import { useState , useEffect  , useCallback } from "react";
import MovieCard from "./components/MovieCard";
import MovieDetails from "./components/MovieDetails";


function App(){
  const [searchTerm , setSearchTerm] = useState("");
  const [movies , setMovies] = useState([]);
  const [selectedMovie , setSelectedMovie] = useState(null);
  const [loading , setLoading] = useState(false)
  const [error , setError] = useState("");
  const [noResult , setNoResults] = useState(false)

  const searchMovies = useCallback( async (term) => {
    if (!term.trim()) {
      return
    }
  
    setLoading(true)
    setError("")
    setNoResults(false)
    setSelectedMovie(null)
  
    const apikey = import.meta.env.VITE_OMDB_API_KEY
  
    try {
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=${apikey}&s=${term}`
      )
  
      if (!response.ok) {
        throw new Error("Network request failed")
      }
  
      const data = await response.json()
  
      if (data.Response === "True") {
        setMovies(data.Search)
      } else {
        setMovies([])
        setNoResults(true)
      }
  
    } catch (error) {
      console.log(error)
  
      setMovies([])
      setError("Something went wrong. Please try again.")
  
    } finally {
      setLoading(false)
    }
  } ,[] )

  useEffect(() =>{
    if(!searchTerm.trim()){
      return
    }

    const timer = setTimeout(()=>{
      searchMovies(searchTerm)
    }, 600)

    return ()=>{
      clearTimeout(timer)
    }
  } , [searchTerm , searchMovies]);


  const handleSearch =   (e) => {
    const value = e. target.value
    setSearchTerm(value)

    if(!value.trim()){
      setMovies([])
      setNoResults(false)
      setError("");
      setSelectedMovie(null)
    }

  }

  const getMovieDetails = async (movieId) =>{
    console.log("clicked movie Id ", movieId)
    const apikey = import.meta.env.VITE_OMDB_API_KEY

    const cleanMovieId = movieId.trim()
      const url = `https://www.omdbapi.com/?apikey=${apikey}&i=${cleanMovieId}`;

      console.log(
    "Detail URL:",
    `https://www.omdbapi.com/?apikey=HIDDEN&i=${cleanMovieId}`
  )



    const response = await fetch(url)

    const data = await response.json()

    console.log("Movie Deatils" , data)

    if(data.Response === "True"){
      setSelectedMovie(data)

    }
  }

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold">
        Movie Search App
      </h1>

      <form onSubmit={handleSearch}>


      <input type="text" placeholder="Search movie ..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border p-2 rounded "/>

      <button  type="submit" className="border p-2 ml-2 rounded ">
        Search
      </button>

      </form>

      {loading && (
        <p className="mt-4">
          Loading movies...
        </p>
      )}
      {error &&(
        <p className="mt-4">
          {error}
        </p>
      )}
      {noResult && !loading && (
        <p className="mt-4">
          No Movie found
        </p>
      )}

      <MovieDetails  movie={selectedMovie}/>

      <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {movies.map((movie)=>(
          <MovieCard
          key={movie.imdbID}
          movie={movie}
          onSelect={getMovieDetails}
          />
        ))}
      </div>

      <p className="mt-4">
        You searched: {searchTerm}
      </p>

    </div>
  )
}

export default App;