import axios from '@/config/axios'
import { BackendResponse, Category, Paginate } from '@/types'
export const getCategoryApi = () => {
  return axios.get<void, BackendResponse<Category[]>>('categories')
}

export const getCategoryBySlugApi = (slug: string) => {
  return axios.get<void, BackendResponse<Category>>(`categories/${slug}`)
}
export const createCategoryrApi = (category: Category) => {
  return axios.post<void, BackendResponse<Category>>(`categories`, category)
}
export const updateCategoryApi = (category: Category) => {
  return axios.put<void, BackendResponse<Category>>(`categories`, category)
}
export const deleteCategoryApi = (id: string) => {
  return axios.delete<void, BackendResponse<Category>>(`categories/${id}`)
}
export const getCategoryFilterApi = (params: Record<string, string>) => {
  return axios.get<void, BackendResponse<Paginate<Category>>>('categories/paginate', {
    params
  })
}
