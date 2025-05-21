export interface NotificationType {
  id: string // MongoDB ObjectId dạng string
  senderId?: string
  receiverId?: string
  content?: string
  isRead: boolean
  type?: 'message' | 'friend_request' | 'like' | string
  createdAt: string // ISO 8601 format (e.g. "2025-05-07T12:00:00Z")
}
