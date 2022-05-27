export interface CATEGORY {
  id: number
  category: string
}

export interface HOUSEWORK {
  id: number
  housework_name: string
  category: CATEGORY
  description: string
  estimated_time: number
  create_user: number
}
