import axios from '@/config/axios'
import { BackendResponse, Paginate, Post } from '@/types'
export const getPostBySlugApi = (slug: string) => {
  return axios.get<void, BackendResponse<Post>>(`post/get-by-slug/${slug}`)
}
export const getPostFilter = (params: Record<string, string>) => {
  return axios.get<void, BackendResponse<Paginate<Post>>>(`post/paginate`, { params })
}
export const createPostApi = (post: Post) => {
  return axios.post<void, BackendResponse<Post>>(`post/create`, post)
}
export const updatePostApi = (post: Post) => {
  return axios.put<void, BackendResponse<Post>>(`post/update`, post)
}
export const deletePostApi = (id: string) => {
  return axios.delete<void, BackendResponse<Post>>(`post/delete/${id}`)
}
