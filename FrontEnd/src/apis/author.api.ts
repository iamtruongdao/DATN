import axios from '@/config/axios'
import { Author, BackendResponse, Paginate } from '@/types'

export const getAuthorApi = (params: { pageSize: number; pageNumber: number }) => {
  return axios.get<void, BackendResponse<Paginate<Author>>>('authors/paginate', {
    params
  })
}
export const getAuthorFilterApi = (params: Record<string, string>) => {
  return axios.get<void, BackendResponse<Paginate<Author>>>('authors/paginate', {
    params
  })
}
export const getAuthorByIdApi = (slug?: string) => {
  return axios.get<void, BackendResponse<Author>>(`authors/${slug}`)
}
export const getAllAuthorApi = () => {
  return axios.get<void, BackendResponse<Author[]>>('authors')
}
export const createAuthorApi = (author: Author) => {
  return axios.post<void, BackendResponse<Author>>(`authors`, author)
}
export const updateAuthorApi = (author: Author) => {
  return axios.put<void, BackendResponse<Author>>(`authors`, author)
}
export const deleteAuthorApi = (id: string) => {
  return axios.delete<void, BackendResponse<Author>>(`authors/${id}`)
}
