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

export interface TASK {
  id: number
  task_name: string
  category: CATEGORY
  status: string
  assigned_user: string
  scheduled_date: string
  result_date: string
  result_time: number
}
