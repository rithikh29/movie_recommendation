"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Film, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"

interface Movie {
  title: string
  poster: string
}

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedMovie = searchParams.get("movie")

  const apiBase = "http://127.0.0.1:5000"

  useEffect(() => {
    if (!selectedMovie) {
      router.push("/")
      return
    }

    const getRecommendations = async () => {
      setLoading(true)
      setError("")

      try {
        const response = await fetch(`${apiBase}/recommend`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ movie: selectedMovie }),
        })

        const data = await response.json()

        if (data.recommended_movies && data.recommended_posters) {
          const movieData = data.recommended_movies.map((title: string, index: number) => ({
            title,
            poster: data.recommended_posters[index],
          }))
          setRecommendations(movieData)
        } else {
          setRecommendations([])
        }
      } catch (err) {
        console.error(err)
        setError("Failed to get recommendations")
      } finally {
        setLoading(false)
      }
    }

    getRecommendations()
  }, [selectedMovie, router])

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
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={() => router.push("/")}
            variant="ghost"
            className="text-white dark:text-white light:text-gray-800 hover:bg-white/20 dark:hover:bg-white/20 light:hover:bg-white/50"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Search
          </Button>
        </div>

        {selectedMovie && (
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              <h1 className="text-3xl font-bold text-white dark:text-white light:text-gray-800">Recommendations for</h1>
            </div>
            <p className="text-2xl text-purple-200 dark:text-purple-200 light:text-purple-700 font-semibold">
              {selectedMovie}
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl text-white dark:text-white light:text-gray-800">Finding perfect recommendations...</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-4 text-red-200 dark:text-red-200 light:text-red-700 text-center">
              {error}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {!loading && recommendations.length > 0 && (
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {recommendations.map((movie, index) => (
                <Card
                  key={index}
                  className="group bg-white/10 dark:bg-white/10 light:bg-white/80 backdrop-blur-lg border-white/20 dark:border-white/20 light:border-gray-200 hover:bg-white/20 dark:hover:bg-white/20 light:hover:bg-white/90 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer overflow-hidden"
                >
                  <CardContent className="p-0">
                    <div className="aspect-[2/3] relative overflow-hidden">
                      <img
                        src={movie.poster || "/placeholder.svg"}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg?height=300&width=200"
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-white dark:text-white light:text-gray-800 text-sm leading-tight line-clamp-2 group-hover:text-purple-200 dark:group-hover:text-purple-200 light:group-hover:text-purple-600 transition-colors duration-200">
                        {movie.title}
                      </h3>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && recommendations.length === 0 && selectedMovie && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-white/10 dark:bg-white/10 light:bg-gray-200 rounded-full flex items-center justify-center">
              <Film className="w-12 h-12 text-white/50 dark:text-white/50 light:text-gray-500" />
            </div>
            <p className="text-xl text-white/70 dark:text-white/70 light:text-gray-600">No recommendations found</p>
            <p className="text-white/50 dark:text-white/50 light:text-gray-500 mt-2">Try selecting a different movie</p>
            <Button
              onClick={() => router.push("/")}
              className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              Choose Another Movie
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
