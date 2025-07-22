"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Film, AlertCircle, Search, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface MovieRecommendation {
  recommended_movies: string[]
  recommended_posters: string[]
}

export default function MovieRecommendationSystem() {
  const [movies, setMovies] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedMovie, setSelectedMovie] = useState<string>("")
  const [filteredMovies, setFilteredMovies] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [recommendations, setRecommendations] = useState<MovieRecommendation | null>(null)
  const [isLoadingMovies, setIsLoadingMovies] = useState(true)
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false)
  const [error, setError] = useState<string>("")

  const searchRef = useRef<HTMLDivElement>(null)
  const apiBase = "https://moviebackend-8gld.onrender.com"

  // Load movies on component mount
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoadingMovies(true)
        setError("")
        const response = await fetch(`${apiBase}/movies`)

        if (!response.ok) {
          throw new Error("Failed to fetch movies")
        }

        const data = await response.json()
        setMovies(data.movies || [])
      } catch (err) {
        setError("Failed to load movies. Please try again later.")
        console.error("Error fetching movies:", err)
      } finally {
        setIsLoadingMovies(false)
      }
    }

    fetchMovies()
  }, [])

  // Filter movies based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredMovies([])
      setShowSuggestions(false)
      return
    }

    const filtered = movies.filter((movie) => movie.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 10) // Limit to 10 suggestions

    setFilteredMovies(filtered)
    setShowSuggestions(filtered.length > 0)
  }, [searchQuery, movies])

  // Handle clicking outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Handle movie selection from suggestions
  const handleMovieSelect = (movie: string) => {
    setSelectedMovie(movie)
    setSearchQuery(movie)
    setShowSuggestions(false)
    setRecommendations(null) // Clear previous recommendations
  }

  // Clear search and selection
  const clearSearch = () => {
    setSearchQuery("")
    setSelectedMovie("")
    setShowSuggestions(false)
    setRecommendations(null)
    setError("")
  }

  // Get recommendations for selected movie
  const getRecommendations = async () => {
    if (!selectedMovie) {
      setError("Please search and select a movie first.")
      return
    }

    try {
      setIsLoadingRecommendations(true)
      setError("")
      setRecommendations(null)

      const response = await fetch(`${apiBase}/recommend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ movie: selectedMovie }),
      })

      if (!response.ok) {
        throw new Error("Failed to get recommendations")
      }

      const data = await response.json()

      if (data.recommended_movies && data.recommended_posters) {
        setRecommendations(data)
      } else {
        setError("No recommendations found for this movie.")
      }
    } catch (err) {
      setError("Failed to get recommendations. Please try again.")
      console.error("Error getting recommendations:", err)
    } finally {
      setIsLoadingRecommendations(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Film className="h-8 w-8 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-800">Movie Recommendation System</h1>
          </div>
          <p className="text-gray-600 text-lg">Search for a movie and discover your next favorite films</p>
        </div>

        {/* Movie Search */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <div className="w-full sm:w-auto min-w-[400px] relative" ref={searchRef}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder={isLoadingMovies ? "Loading movies..." : "Search for a movie..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => filteredMovies.length > 0 && setShowSuggestions(true)}
                  disabled={isLoadingMovies}
                  className="pl-10 pr-10"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Search Suggestions */}
              {showSuggestions && filteredMovies.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto mt-1">
                  {filteredMovies.map((movie, index) => (
                    <button
                      key={index}
                      onClick={() => handleMovieSelect(movie)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center gap-2">
                        <Film className="h-4 w-4 text-gray-400" />
                        <span className="truncate">{movie}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* No results message */}
              {showSuggestions && filteredMovies.length === 0 && searchQuery.trim() !== "" && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 mt-1">
                  <div className="px-4 py-3 text-gray-500 text-center">No movies found matching "{searchQuery}"</div>
                </div>
              )}
            </div>

            <Button
              onClick={getRecommendations}
              disabled={!selectedMovie || isLoadingRecommendations || isLoadingMovies}
              className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700"
            >
              {isLoadingRecommendations ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Getting Recommendations...
                </>
              ) : (
                "Get Recommendations"
              )}
            </Button>
          </div>

          {/* Selected Movie Display */}
          {selectedMovie && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Selected movie: <span className="font-semibold text-purple-600">{selectedMovie}</span>
              </p>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isLoadingRecommendations && (
          <div className="text-center py-12">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-purple-600 mb-4" />
            <p className="text-gray-600 text-lg">Finding perfect recommendations for you...</p>
          </div>
        )}

        {/* Recommendations Display */}
        {recommendations && !isLoadingRecommendations && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Movies Similar to "{selectedMovie}"</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {recommendations.recommended_movies.map((title, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-0">
                    <div className="aspect-[2/3] relative overflow-hidden">
                      <img
                        src={recommendations.recommended_posters[index] || "/placeholder.svg"}
                        alt={title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg?height=300&width=200&text=No+Image"
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-sm text-gray-800 text-center leading-tight">{title}</h3>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!recommendations && !isLoadingRecommendations && !error && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-2">Search for a movie to get started!</p>
            <p className="text-gray-500 text-sm">
              Type in the search box above to find movies and get personalized recommendations
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
