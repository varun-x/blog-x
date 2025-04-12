import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BlogCard } from "@/components/blog-card"
import { Calendar, Clock, Eye, Heart, MessageSquare, Share2, Bookmark } from "lucide-react"
import { generateMockBlogs } from "@/lib/mock-data"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  // Generate mock blogs
  const allBlogs = generateMockBlogs(20)

  // Find the blog post by slug
  const blog = allBlogs.find((blog) => blog.slug === params.slug)

  // If blog post not found, return 404
  if (!blog) {
    notFound()
  }

  // Get related blogs (same category)
  const relatedBlogs = allBlogs.filter((b) => b.id !== blog.id && b.category === blog.category).slice(0, 3)

  const { title, content, coverImage, author, category, tags, publishDate, readTime, views, likes, comments } = blog

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(publishDate)

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Blog Header */}
          <div className="space-y-4">
            <Link href={`/explore?category=${category}`}>
              <Badge className="mb-2">{category}</Badge>
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={author.avatar} alt={author.name} />
                  <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <Link href={`/profile/${author.username}`} className="font-medium hover:underline">
                    {author.name}
                  </Link>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{formattedDate}</span>
                    <span>•</span>
                    <Clock className="h-3 w-3" />
                    <span>{readTime} min read</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <Image src={coverImage || "/placeholder.svg"} alt={title} fill className="object-cover" priority />
          </div>

          {/* Blog Content */}
          <div className="prose dark:prose-invert max-w-none">
            {content.split("<p>").map((paragraph, index) => {
              if (!paragraph) return null
              const cleanParagraph = paragraph.replace("</p>", "")
              return <p key={index}>{cleanParagraph}</p>
            })}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link key={tag} href={`/explore?search=${tag}`}>
                <Badge variant="outline">#{tag}</Badge>
              </Link>
            ))}
          </div>

          {/* Engagement */}
          <Card className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-6">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  <span>{likes}</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>{comments}</span>
                </Button>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Eye className="h-5 w-5" />
                  <span>{views} views</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Bookmark className="h-5 w-5" />
                  <span className="sr-only">Save</span>
                </Button>
                <Button variant="ghost" size="icon">
                  <Share2 className="h-5 w-5" />
                  <span className="sr-only">Share</span>
                </Button>
              </div>
            </div>
          </Card>

          {/* Author Bio */}
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
              <Avatar className="h-16 w-16">
                <AvatarImage src={author.avatar} alt={author.name} />
                <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg font-bold">{author.name}</h3>
                <p className="text-muted-foreground mb-4">{author.bio}</p>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/profile/${author.username}`}>View Profile</Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Related Posts */}
          <div>
            <h2 className="text-xl font-bold mb-4">Related Posts</h2>
            <div className="space-y-4">
              {relatedBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} variant="compact" />
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h2 className="text-xl font-bold mb-4">Discover More</h2>
            <div className="flex flex-wrap gap-2">
              {["Technology", "Health", "Design", "Travel", "Food"].map((cat) => (
                <Link key={cat} href={`/explore?category=${cat}`}>
                  <Badge variant="secondary" className="mb-2">
                    {cat}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

