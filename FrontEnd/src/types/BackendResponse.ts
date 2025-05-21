export interface BackendResponse<T> {
  code: number
  message?: string
  data: T
}
