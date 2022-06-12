export interface CATEGORY {
  id: number
  category_name: string
}

export interface USER {
  id: number
  username: string
}

export interface HOUSEWORK {
  id: number
  housework_name: string
  category: CATEGORY
  description: string
  estimated_time: number
  create_user: USER
}

export interface TASK {
  id: number
  task_name: string
  category: CATEGORY
  status: string
  assigned_user: USER
  scheduled_date: string
  result_date: string
  result_time: number
}
