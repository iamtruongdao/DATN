import axios from '@/config/axios'
import { BackendResponse, Paginate } from '@/types'
import { Tag } from '@/types'
export const getAllTagApi = (params: Record<string, string>) => {
  return axios.get<void, BackendResponse<Paginate<Tag>>>('tag', { params })
}
export const getTagBySlugApi = (slug: string, pageSize: number, pageNumber: number) => {
  return axios.get<void, BackendResponse<Tag>>(`tag/slug/${slug}`, {
    params: {
      pageSize,
      pageNumber
    }
  })
}
export const createTagApi = (tag: Tag) => {
  return axios.post<void, BackendResponse<Tag>>('tag/create', tag)
}
export const updateTagApi = (tag: Tag) => {
  return axios.put<void, BackendResponse<Tag>>('tag/update', tag)
}
export const deleteTagApi = (id: string) => {
  return axios.delete<void, BackendResponse<Tag>>(`tag/delete/${id}`)
}
