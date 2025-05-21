import axios from '@/config/axios'
import { BackendResponse, Book, Paginate } from '@/types'
export const getBookApi = (slug?: string) => {
  return axios.get<void, BackendResponse<Book>>(`products/${slug}`)
}
export const getBookByAuthorApi = (author: string) => {
  return axios.get<void, BackendResponse<Book>>(`products/get-by-author/${author}`)
}
export const getBookFilterApi = (params: Record<string, string>) => {
  return axios.get<void, BackendResponse<Paginate<Book>>>(`products/paginate`, {
    params
  })
}
export const createBookApi = (book: Book) => {
  return axios.post<void, BackendResponse<Book>>(`products`, book)
}
export const updateBookApi = (book: Book) => {
  return axios.put<void, BackendResponse<Book>>(`products`, book)
}
export const deleteBookApi = (id: string) => {
  return axios.delete<void, BackendResponse<Book>>(`products/${id}`)
}
export const getWaitPublishBookApi = () => {
  return axios.get<void, BackendResponse<Paginate<Book>>>(`products/wait-publish`)
}
export const getTopBookApi = (params: Record<string, string>) => {
  return axios.get<void, BackendResponse<Paginate<Book>>>(`products/top-product`, { params })
}
