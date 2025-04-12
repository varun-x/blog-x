"use client"

import { useState, useEffect } from "react"
import {
  generateMockBlogs,
  generateUserInterests,
  getPersonalizedBlogs,
  type Blog,
  type Category,
} from "@/lib/mock-data"
import { BlogCard } from "@/components/blog-card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Settings } from "lucide-react"

const allCategories: Category[] = [
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

export default function ForYouPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [userInterests, setUserInterests] = useState<Category[]>([])
  const [personalizedBlogs, setPersonalizedBlogs] = useState<Blog[]>([])
  const [selectedTab, setSelectedTab] = useState<string>("for-you")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [tempInterests, setTempInterests] = useState<Category[]>([])

  // Generate mock data on component mount
  useEffect(() => {
    const generatedBlogs = generateMockBlogs(30)
    setBlogs(generatedBlogs)

    // Generate random user interests if none exist
    if (userInterests.length === 0) {
      const interests = generateUserInterests()
      setUserInterests(interests)
      setTempInterests(interests)
    }
  }, [userInterests.length])

  // Update personalized blogs when dependencies change
  useEffect(() => {
    if (blogs.length > 0 && userInterests.length > 0) {
      const personalized = getPersonalizedBlogs(blogs, userInterests)
      setPersonalizedBlogs(personalized)
    }
  }, [blogs, userInterests])

  // Filter blogs by tab
  const getFilteredBlogs = () => {
    if (selectedTab === "for-you") {
      return personalizedBlogs
    }

    return blogs.filter((blog) => blog.category === selectedTab)
  }

  // Handle interest toggle
  const toggleInterest = (category: Category) => {
    setTempInterests((prev) => (prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]))
  }

  // Save interests
  const saveInterests = () => {
    setUserInterests(tempInterests)
    setIsDialogOpen(false)
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">For You</h1>
          <p className="text-muted-foreground">Content tailored to your interests</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Customize
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Customize Your Feed</DialogTitle>
              <DialogDescription>Select topics you're interested in to personalize your feed.</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              {allCategories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={tempInterests.includes(category)}
                    onCheckedChange={() => toggleInterest(category)}
                  />
                  <Label htmlFor={category}>{category}</Label>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button onClick={saveInterests}>Save preferences</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="for-you" value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="mb-4 flex flex-wrap h-auto">
          <TabsTrigger value="for-you">For You</TabsTrigger>
          {userInterests.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedTab} className="mt-0">
          {getFilteredBlogs().length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No blogs found</h3>
              <p className="text-muted-foreground">Try selecting different interests in your preferences</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredBlogs().map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Recommendations */}
      {selectedTab === "for-you" && personalizedBlogs.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Why we think you'll like these</h2>
          <div className="bg-muted/50 rounded-lg p-6">
            <p className="text-muted-foreground mb-4">
              We've curated these articles based on your interest in{" "}
              <span className="font-medium text-foreground">{userInterests.join(", ")}</span>
            </p>
            <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
              Update Preferences
            </Button>
          </div>
        </section>
      )}
    </div>
  )
}

