"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { BlogCard } from "@/components/blog-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { generateMockUser, generateMockBlogs, type User, type Blog } from "@/lib/mock-data"
import { Calendar, Edit, ExternalLink, Github, Globe, Linkedin, Settings, Twitter, Users } from "lucide-react"

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [userBlogs, setUserBlogs] = useState<Blog[]>([])
  const [savedBlogs, setSavedBlogs] = useState<Blog[]>([])

  // Generate mock data on component mount
  useEffect(() => {
    const mockUser = generateMockUser()
    setUser(mockUser)

    const allBlogs = generateMockBlogs(20)
    // Assign some blogs to the user
    const userBlogCount = Math.floor(Math.random() * 8) + 3 // 3-10 blogs
    const userBlogsList = allBlogs.slice(0, userBlogCount).map((blog) => ({
      ...blog,
      author: mockUser,
    }))
    setUserBlogs(userBlogsList)

    // Some random saved blogs
    const savedBlogCount = Math.floor(Math.random() * 6) + 2 // 2-7 blogs
    const savedBlogsList = allBlogs.slice(userBlogCount, userBlogCount + savedBlogCount)
    setSavedBlogs(savedBlogsList)
  }, [])

  if (!user) {
    return (
      <div className="container py-8 text-center">
        <p>Loading profile...</p>
      </div>
    )
  }

  const { name, username, avatar, bio, joinDate, followers, following, socialLinks } = user

  const formattedJoinDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(joinDate)

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Sidebar */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader className="relative pb-0">
              <div className="absolute top-4 right-4">
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/profile/settings">
                    <Settings className="h-5 w-5" />
                    <span className="sr-only">Settings</span>
                  </Link>
                </Button>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="relative w-24 h-24 mb-4">
                  <Image src={avatar || "/placeholder.svg"} alt={name} fill className="rounded-full object-cover" />
                </div>
                <CardTitle className="text-2xl">{name}</CardTitle>
                <CardDescription>@{username}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <p className="text-center">{bio}</p>

                <div className="flex justify-center gap-8 py-2">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{followers}</p>
                    <p className="text-sm text-muted-foreground">Followers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{following}</p>
                    <p className="text-sm text-muted-foreground">Following</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {formattedJoinDate}</span>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {socialLinks.twitter && (
                    <Button variant="outline" size="icon" asChild>
                      <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                        <Twitter className="h-4 w-4" />
                        <span className="sr-only">Twitter</span>
                      </a>
                    </Button>
                  )}
                  {socialLinks.linkedin && (
                    <Button variant="outline" size="icon" asChild>
                      <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-4 w-4" />
                        <span className="sr-only">LinkedIn</span>
                      </a>
                    </Button>
                  )}
                  {socialLinks.github && (
                    <Button variant="outline" size="icon" asChild>
                      <a href={socialLinks.github} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4" />
                        <span className="sr-only">GitHub</span>
                      </a>
                    </Button>
                  )}
                  {socialLinks.website && (
                    <Button variant="outline" size="icon" asChild>
                      <a href={socialLinks.website} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4" />
                        <span className="sr-only">Website</span>
                      </a>
                    </Button>
                  )}
                </div>

                <div className="pt-4">
                  <Button className="w-full" asChild>
                    <Link href="/profile/edit">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Connections</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/profile/connections">
                  <Users className="mr-2 h-4 w-4" />
                  View All Connections
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2">
          <Tabs defaultValue="posts">
            <TabsList className="mb-6">
              <TabsTrigger value="posts">My Posts</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
              <TabsTrigger value="drafts">Drafts</TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="mt-0">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Published Posts</h2>
                <Button asChild>
                  <Link href="/write">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    New Post
                  </Link>
                </Button>
              </div>

              {userBlogs.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground mb-4">You haven't published any posts yet.</p>
                    <Button asChild>
                      <Link href="/write">Write Your First Post</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {userBlogs.map((blog) => (
                    <BlogCard key={blog.id} blog={blog} variant="compact" />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="saved" className="mt-0">
              <h2 className="text-xl font-bold mb-6">Saved Posts</h2>

              {savedBlogs.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground mb-4">You haven't saved any posts yet.</p>
                    <Button asChild>
                      <Link href="/explore">Explore Posts</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {savedBlogs.map((blog) => (
                    <BlogCard key={blog.id} blog={blog} variant="compact" />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="drafts" className="mt-0">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Draft Posts</h2>
                <Button asChild>
                  <Link href="/write">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    New Draft
                  </Link>
                </Button>
              </div>

              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground mb-4">You don't have any drafts.</p>
                  <Button asChild>
                    <Link href="/write">Start Writing</Link>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

