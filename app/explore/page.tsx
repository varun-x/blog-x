"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { generateMockBlogs, type Blog, type Category } from "@/lib/mock-data"
import { BlogCard } from "@/components/blog-card"
import { CategoryCard } from "@/components/category-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"

const categories: Category[] = [
  "Technology",
  "Health",
  "Design",
  "Travel",
  "Food",
  "Lifestyle",
  "Business",
  "Finance",
  "Education",
  "Entertainment",
]

export default function ExplorePage() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get("category") as Category | null
  const initialSort = searchParams.get("sort") || "recent"
  const initialSearch = searchParams.get("search") || ""

  const [blogs, setBlogs] = useState<Blog[]>([])
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">(initialCategory || "all")
  const [sortBy, setSortBy] = useState(initialSort)
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [view, setView] = useState<"grid" | "list">("grid")

  // Generate mock data on component mount
  useEffect(() => {
    const generatedBlogs = generateMockBlogs(30)
    setBlogs(generatedBlogs)
  }, [])

  // Filter and sort blogs when dependencies change
  useEffect(() => {
    let result = [...blogs]

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter((blog) => blog.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (blog) =>
          blog.title.toLowerCase().includes(query) ||
          blog.excerpt.toLowerCase().includes(query) ||
          blog.author.name.toLowerCase().includes(query) ||
          blog.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    // Sort blogs
    switch (sortBy) {
      case "recent":
        result.sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime())
        break
      case "popular":
        result.sort((a, b) => b.views - a.views)
        break
      case "trending":
        result = result.filter((blog) => blog.isTrending)
        break
      case "featured":
        result = result.filter((blog) => blog.isFeatured)
        break
    }

    setFilteredBlogs(result)
  }, [blogs, selectedCategory, sortBy, searchQuery])

  // Calculate category counts
  const categoryCounts = categories.map((category) => ({
    category,
    count: blogs.filter((blog) => blog.category === category).length,
  }))

  return (
    <div className="container py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Explore Blogs</h1>
        <p className="text-muted-foreground">Discover new content across various topics and interests</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by title, author, or tags..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="trending">Trending</SelectItem>
              <SelectItem value="featured">Featured</SelectItem>
            </SelectContent>
          </Select>
          <div className="hidden md:flex">
            <Button
              variant={view === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setView("grid")}
              className="rounded-r-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
            </Button>
            <Button
              variant={view === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setView("list")}
              className="rounded-l-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <Tabs
        defaultValue="all"
        value={selectedCategory}
        onValueChange={(value) => setSelectedCategory(value as Category | "all")}
      >
        <TabsList className="mb-4 flex flex-wrap h-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
            {categoryCounts.map(({ category, count }) => (
              <CategoryCard key={category} category={category} count={count} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-medium">
            {filteredBlogs.length} {filteredBlogs.length === 1 ? "result" : "results"}
          </h2>
        </div>

        {filteredBlogs.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">No blogs found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} variant="compact" />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

