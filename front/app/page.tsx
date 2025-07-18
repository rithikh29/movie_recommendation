"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Film, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"

export default function HomePage() {
  const [movies, setMovies] = useState<string[]>([])
  const [selectedMovie, setSelectedMovie] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [loadingMovies, setLoadingMovies] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  const apiBase = "https://moviebackend-8gld.onrender.com"

  // Load movies on component mount
  useEffect(() => {
    fetch(`${apiBase}/movies`)
      .then((res) => res.json())
      .then((data) => {
        setMovies(data.movies || [])
        setLoadingMovies(false)
      })
      .catch((err) => {
        console.error(err)
        setError("Failed to load movies")
        setLoadingMovies(false)
      })
  }, [])

  // Filter movies based on search term
  const filteredMovies = movies.filter((movie) => movie.toLowerCase().includes(searchTerm.toLowerCase()))

  const selectMovie = (movie: string) => {
    setSelectedMovie(movie)
    setSearchTerm("")
  }

  const handleGetRecommendations = () => {
    if (selectedMovie) {
      router.push(`/recommendations?movie=${encodeURIComponent(selectedMovie)}`)
    }
  }

  return (
    <div className="min-h-screen relative">
      <ThemeToggle />

      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 dark:from-purple-900 dark:via-blue-900 dark:to-indigo-900 light:from-purple-100 light:via-blue-100 light:to-indigo-100"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="h-full w-full bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-y-12"></div>
          <div className="absolute top-0 h-full w-full bg-gradient-to-b from-transparent via-white/3 to-transparent transform skew-x-12"></div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
              <Film className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-purple-200 dark:from-white dark:to-purple-200 light:from-gray-800 light:to-purple-600 bg-clip-text text-transparent">
              CineMatch
            </h1>
          </div>
          <p className="text-xl text-purple-200 dark:text-purple-200 light:text-purple-700 max-w-2xl mx-auto">
            Discover your next favorite movie with AI-powered recommendations
          </p>
        </div>

        {/* Movie Selection */}
        <div className="max-w-2xl mx-auto mb-12">
          <Card className="bg-white/10 dark:bg-white/10 light:bg-white/80 backdrop-blur-lg border-white/20 dark:border-white/20 light:border-gray-200 shadow-2xl">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-white dark:text-white light:text-gray-800 font-medium mb-3 text-lg">
                    Choose a movie you love
                  </label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-400 light:text-gray-600 w-5 h-5" />
                    <Input
                      type="text"
                      placeholder={loadingMovies ? "Loading movies..." : "Search for a movie..."}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 h-14 text-lg bg-white/20 dark:bg-white/20 light:bg-white/50 border-white/30 dark:border-white/30 light:border-gray-300 text-white dark:text-white light:text-gray-800 placeholder:text-gray-300 dark:placeholder:text-gray-300 light:placeholder:text-gray-500 focus:bg-white/30 dark:focus:bg-white/30 light:focus:bg-white/70 transition-all duration-300"
                      disabled={loadingMovies}
                    />
                  </div>

                  {/* Movie Suggestions */}
                  {searchTerm && (
                    <div className="mt-3 max-h-48 overflow-y-auto bg-white/20 dark:bg-white/20 light:bg-white/90 backdrop-blur-lg rounded-lg border border-white/20 dark:border-white/20 light:border-gray-200">
                      {filteredMovies.slice(0, 8).map((movie, index) => (
                        <button
                          key={index}
                          onClick={() => selectMovie(movie)}
                          className="w-full text-left px-4 py-3 text-white dark:text-white light:text-gray-800 hover:bg-white/20 dark:hover:bg-white/20 light:hover:bg-gray-100 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg"
                        >
                          {movie}
                        </button>
                      ))}
                      {filteredMovies.length === 0 && (
                        <div className="px-4 py-3 text-gray-300 dark:text-gray-300 light:text-gray-600">
                          No movies found
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {selectedMovie && (
                  <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 dark:from-purple-500/20 dark:to-pink-500/20 light:from-purple-200/50 light:to-pink-200/50 rounded-lg border border-purple-400/30 dark:border-purple-400/30 light:border-purple-300">
                    <div className="flex items-center gap-2 text-white dark:text-white light:text-gray-800">
                      <span className="font-medium">Selected:</span>
                      <span className="text-purple-200 dark:text-purple-200 light:text-purple-700">
                        {selectedMovie}
                      </span>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleGetRecommendations}
                  disabled={!selectedMovie}
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 group text-white"
                >
                  <div className="flex items-center gap-2">
                    Get Recommendations
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-4 text-red-200 dark:text-red-200 light:text-red-700 text-center">
              {error}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
