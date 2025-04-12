import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BlogCard } from "@/components/blog-card"
import { CategoryCard } from "@/components/category-card"
import {
  generateMockBlogs,
  getTrendingBlogs,
  getFeaturedBlogs,
  getPopularBlogs,
  getTrendingCategories,
} from "@/lib/mock-data"

export default function Home() {
  // Generate mock data
  const allBlogs = generateMockBlogs(30)
  const featuredBlogs = getFeaturedBlogs(allBlogs).slice(0, 3)
  const trendingBlogs = getTrendingBlogs(allBlogs).slice(0, 4)
  const popularBlogs = getPopularBlogs(allBlogs).slice(0, 6)
  const trendingCategories = getTrendingCategories(allBlogs)

  return (
    <div className="container py-8 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-4 py-8 md:py-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Discover, Read, and Share Ideas</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Join our community of writers and readers to explore new perspectives and share your own stories.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Button size="lg" asChild>
            <Link href="/write">Start Writing</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/explore">Explore Blogs</Link>
          </Button>
        </div>
      </section>

      {/* Featured Blogs */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">Featured Stories</h2>
          <Button variant="ghost" asChild>
            <Link href="/explore?featured=true">View All</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredBlogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} variant="featured" />
          ))}
        </div>
      </section>

      {/* Trending Topics */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">Trending Topics</h2>
          <Button variant="ghost" asChild>
            <Link href="/explore">Explore All</Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {trendingCategories.map(({ category, count }) => (
            <CategoryCard key={category} category={category} count={count} />
          ))}
        </div>
      </section>

      {/* Trending Blogs */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">Trending Now</h2>
          <Button variant="ghost" asChild>
            <Link href="/explore?trending=true">View All</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trendingBlogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      </section>

      {/* Popular Blogs */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">Popular Reads</h2>
          <Button variant="ghost" asChild>
            <Link href="/explore?sort=popular">View All</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularBlogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      </section>

      {/* About the Platform */}
      <section className="bg-muted/50 rounded-lg p-8 md:p-12">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold">About ModernBlog</h2>
          <p className="text-lg text-muted-foreground">
            ModernBlog is a platform designed for writers, thinkers, and readers to connect through ideas. We believe in
            the power of storytelling and knowledge sharing to create meaningful connections.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="space-y-2">
              <h3 className="font-bold">For Writers</h3>
              <p className="text-muted-foreground">
                Share your expertise, build an audience, and connect with like-minded individuals.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold">For Readers</h3>
              <p className="text-muted-foreground">
                Discover new perspectives, follow your interests, and engage with quality content.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold">For Communities</h3>
              <p className="text-muted-foreground">
                Create spaces for discussion, collaboration, and collective growth.
              </p>
            </div>
          </div>
          <Button size="lg" className="mt-6" asChild>
            <Link href="/about">Learn More</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

