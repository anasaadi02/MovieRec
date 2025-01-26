/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

// Simulated data fetching function
const fetchItems = (type: 'movie' | 'show', genre: string, page: number) => {
  // In a real app, this would be an API call
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      const items = Array(20).fill(null).map((_, i) => ({
        id: `${type}-${genre}-${page}-${i}`,
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} ${genre} ${page * 20 + i + 1}`,
        genre,
        rating: (Math.random() * 2 + 3).toFixed(1),
        image: `/placeholder.svg?text=${type}${page * 20 + i + 1}`
      }))
      resolve(items)
    }, 500) // Simulate network delay
  })
}

const genres = ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Thriller']

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'movie' | 'show'>('movie')
  const [items, setItems] = useState<any[]>([])
  const [page, setPage] = useState(0)
  const [activeGenre, setActiveGenre] = useState('Action')
  const [loading, setLoading] = useState(false)

  const loadMore = useCallback(async () => {
    if (loading) return
    setLoading(true)
    const newItems = await fetchItems(activeTab, activeGenre, page)
    setItems(prev => [...prev, ...newItems])
    setPage(prev => prev + 1)
    setLoading(false)
  }, [activeTab, activeGenre, page, loading])

  useEffect(() => {
    setItems([])
    setPage(0)
    loadMore()
  }, [activeTab, activeGenre])

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return
      loadMore()
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loadMore])

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 py-4 sticky top-0 z-10">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/home" className="text-2xl font-bold text-teal-500">MovieRec</Link>
          <nav>
            <ul className="flex space-x-4">
              <li><Link href="#" className="hover:text-teal-500 transition">My List</Link></li>
              <li><Link href="#" className="hover:text-teal-500 transition">Profile</Link></li>
            </ul>
          </nav>
          <Button variant="ghost" className="text-gray-300 hover:text-teal-500">
            Log out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Welcome back, Movie Lover!</h1>

        <Tabs defaultValue="movie" className="w-full" onValueChange={(value) => setActiveTab(value as 'movie' | 'show')}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="movie">Movies</TabsTrigger>
            <TabsTrigger value="show">TV Shows</TabsTrigger>
          </TabsList>
          <div className="mb-8">
            <ScrollArea className="w-full whitespace-nowrap rounded-md border">
              <div className="flex w-max space-x-4 p-4">
                {genres.map((genre) => (
                  <Button
                    key={genre}
                    onClick={() => setActiveGenre(genre)}
                    variant={activeGenre === genre ? "default" : "outline"}
                    className="flex-shrink-0"
                  >
                    {genre}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
          <TabsContent value="movie" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {items.map((movie) => (
                <div key={movie.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition transform hover:scale-105">
                  <Image src={movie.image || "/placeholder.svg"} alt={movie.title} width={300} height={450} className="w-full h-64 object-cover" />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{movie.title}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-teal-500">★ {movie.rating}</span>
                      <Button variant="outline" size="sm" className="text-teal-500 border-teal-500 hover:bg-teal-500 hover:text-white">
                        Add to List
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="show" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {items.map((show) => (
                <div key={show.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition transform hover:scale-105">
                  <Image src={show.image || "/placeholder.svg"} alt={show.title} width={300} height={450} className="w-full h-64 object-cover" />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{show.title}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-teal-500">★ {show.rating}</span>
                      <Button variant="outline" size="sm" className="text-teal-500 border-teal-500 hover:bg-teal-500 hover:text-white">
                        Add to List
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        {loading && (
          <div className="text-center mt-8">
            <p className="text-teal-500">Loading more...</p>
          </div>
        )}
      </main>

      <footer className="bg-gray-800 py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} MovieRec. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

