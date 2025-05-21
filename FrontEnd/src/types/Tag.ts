import { Post } from '@/types'

export interface Tag {
  id: string
  name: string
  slug: string
  totalPage?: number
  createdAt: string // ISO date string
  posts: Post[]
}
