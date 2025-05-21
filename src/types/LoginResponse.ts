import { UserResponse } from '@/types'

export interface LoginResponse {
  message: string
  token: object
  userAccount: UserResponse
  roles: string[]
}
