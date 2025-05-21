export type RouteType = {
  breadcrumb: string | ((match: { params: Record<string, string> }, paramName?: Record<string, string>) => BreadType[])
}
export type BreadType = {
  pathname: string
  name: string
}
