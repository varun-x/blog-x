import { faker } from "@faker-js/faker"

export type User = {
  id: string
  name: string
  username: string
  email: string
  avatar: string
  bio: string
  joinDate: Date
  followers: number
  following: number
  socialLinks: {
    twitter?: string
    linkedin?: string
    github?: string
    website?: string
  }
}

export type Category =
  | "Technology"
  | "Health"
  | "Design"
  | "Travel"
  | "Food"
  | "Lifestyle"
  | "Business"
  | "Finance"
  | "Education"
  | "Entertainment"

export type Blog = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string
  author: User
  category: Category
  tags: string[]
  publishDate: Date
  readTime: number
  views: number
  likes: number
  comments: number
  isFeatured: boolean
  isTrending: boolean
}

// Generate a random user
export function generateMockUser(): User {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()

  return {
    id: faker.string.uuid(),
    name: `${firstName} ${lastName}`,
    username: faker.internet.userName({ firstName, lastName }).toLowerCase(),
    email: faker.internet.email({ firstName, lastName }),
    avatar: `/placeholder.svg?height=300&width=300&text=${firstName[0]}${lastName[0]}`,
    bio: faker.lorem.paragraph(),
    joinDate: faker.date.past({ years: 2 }),
    followers: faker.number.int({ min: 0, max: 10000 }),
    following: faker.number.int({ min: 0, max: 500 }),
    socialLinks: {
      twitter: faker.helpers.maybe(() => `https://twitter.com/${faker.internet.userName()}`),
      linkedin: faker.helpers.maybe(() => `https://linkedin.com/in/${faker.internet.userName()}`),
      github: faker.helpers.maybe(() => `https://github.com/${faker.internet.userName()}`),
      website: faker.helpers.maybe(() => faker.internet.url()),
    },
  }
}

// Generate a list of random users
export function generateMockUsers(count = 10): User[] {
  return Array.from({ length: count }, () => generateMockUser())
}

// Generate a random blog post
export function generateMockBlog(author?: User): Blog {
  const title = faker.lorem.sentence({ min: 4, max: 10 })
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

  const blogAuthor = author || generateMockUser()
  const publishDate = faker.date.recent({ days: 60 })
  const content = Array.from(
    { length: faker.number.int({ min: 5, max: 10 }) },
    () => `<p>${faker.lorem.paragraph({ min: 3, max: 8 })}</p>`,
  ).join("")

  // Generate a random width and height for the cover image
  const width = faker.number.int({ min: 800, max: 1200 })
  const height = faker.number.int({ min: 400, max: 600 })

  return {
    id: faker.string.uuid(),
    title,
    slug: title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-"),
    excerpt: faker.lorem.paragraph(),
    content,
    coverImage: `/placeholder.svg?height=${height}&width=${width}`,
    author: blogAuthor,
    category: faker.helpers.arrayElement(allCategories),
    tags: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => faker.word.sample()),
    publishDate,
    readTime: faker.number.int({ min: 2, max: 15 }),
    views: faker.number.int({ min: 10, max: 10000 }),
    likes: faker.number.int({ min: 0, max: 500 }),
    comments: faker.number.int({ min: 0, max: 100 }),
    isFeatured: faker.datatype.boolean({ probability: 0.2 }),
    isTrending: faker.datatype.boolean({ probability: 0.3 }),
  }
}

// Generate a list of random blog posts
export function generateMockBlogs(count = 10, authors?: User[]): Blog[] {
  const blogAuthors = authors || generateMockUsers(Math.min(count, 5))

  return Array.from({ length: count }, () => {
    const randomAuthor = faker.helpers.arrayElement(blogAuthors)
    return generateMockBlog(randomAuthor)
  })
}

// Get blogs by category
export function getBlogsByCategory(blogs: Blog[], category: Category): Blog[] {
  return blogs.filter((blog) => blog.category === category)
}

// Get trending blogs
export function getTrendingBlogs(blogs: Blog[]): Blog[] {
  return blogs.filter((blog) => blog.isTrending)
}

// Get featured blogs
export function getFeaturedBlogs(blogs: Blog[]): Blog[] {
  return blogs.filter((blog) => blog.isFeatured)
}

// Get popular blogs (by views)
export function getPopularBlogs(blogs: Blog[]): Blog[] {
  return [...blogs].sort((a, b) => b.views - a.views)
}

// Get recent blogs
export function getRecentBlogs(blogs: Blog[]): Blog[] {
  return [...blogs].sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime())
}

// Get trending categories
export function getTrendingCategories(blogs: Blog[]): { category: Category; count: number }[] {
  const categories = blogs.map((blog) => blog.category)
  const categoryCounts: Record<string, number> = {}

  categories.forEach((category) => {
    categoryCounts[category] = (categoryCounts[category] || 0) + 1
  })

  return Object.entries(categoryCounts)
    .map(([category, count]) => ({
      category: category as Category,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
}

// Generate user interests
export function generateUserInterests(): Category[] {
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

  const numInterests = faker.number.int({ min: 2, max: 5 })
  return faker.helpers.arrayElements(allCategories, numInterests)
}

// Get personalized blogs based on user interests
export function getPersonalizedBlogs(blogs: Blog[], interests: Category[]): Blog[] {
  const interestBlogs = blogs.filter((blog) => interests.includes(blog.category))
  return interestBlogs.length > 0 ? interestBlogs : faker.helpers.arrayElements(blogs, 5)
}

