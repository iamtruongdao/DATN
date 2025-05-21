export interface Paginate<T> {
  pageIndex: number
  totalPages: number
  items: T[]
}
