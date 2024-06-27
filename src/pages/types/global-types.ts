export interface QueryString {
  sort_by?: string
  sort_order?: 'asc' | 'desc'
  page?: number
  per_page?: number
}
export interface SortOptions {
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}
