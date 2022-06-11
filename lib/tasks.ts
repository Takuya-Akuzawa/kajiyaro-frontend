import fetch from 'node-fetch'
import { TASK } from '../types/Types'

export const getAllTaskData = async () => {
  const res = await fetch(
    new URL(`${process.env.NEXT_PUBLIC_RESTAPI_URL}api/list-task/`).toString()
  )
  const tasks = await res.json()
  return tasks
}

export const getAllTaskIds = async () => {
  const res = await fetch(
    new URL(`${process.env.NEXT_PUBLIC_RESTAPI_URL}api/list-task/`).toString()
  )
  const tasks = await res.json()

  return tasks.map((task) => {
    return {
      params: {
        id: String(task.id),
      },
    }
  })
}

export const getTaskData = async (id: string): Promise<TASK> => {
  const res = await fetch(
    new URL(
      `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/detail-task/${id}/`
    ).toString()
  )
  const task = await res.json()
  return task
}
