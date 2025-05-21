import { Tag } from '@/types'

export interface Post {
  id: string
  thumbnail: string
  title: string
  slug: string
  tagId: string
  tag: Tag[]
  content: string
  createdAt?: string
}
