import { Category } from '@/types'

export interface Book {
  id: string
  productName: string
  productPrice: number
  discountPrice?: number
  discount: number
  productQuantity: number
  productDescription: string
  // public string ProductRating  = string.Empty;
  slug: string
  pageNumber: number
  translator?: string
  publicDate: Date
  avatar: string
  authorName: string
  author: string
  cat: string[]
  category: Category[]
  isPublic?: boolean
  createdAt?: string
  sold?: number
}
