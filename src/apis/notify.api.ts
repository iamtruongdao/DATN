import axios from '@/config/axios'
import { BackendResponse, NotificationType } from '@/types'
export const getNotificationsApi = (page?: number, limit?: number) => {
  return axios.get<void, BackendResponse<NotificationType[]>>('/notification', {
    params: {
      page,
      limit
    }
  })
}

export const markAsReadApi = (ids: string[]) => {
  return axios.post<void, BackendResponse<NotificationType>>('/notification/mark-as-read', ids)
}
