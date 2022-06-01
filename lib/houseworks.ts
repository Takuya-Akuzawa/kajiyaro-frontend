import fetch from 'node-fetch'
import { HOUSEWORK } from '../types/Types'

export const getAllHouseworkData = async () => {
  const res = await fetch(
    new URL(
      `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/list-housework/`
    ).toString()
  )
  const houseworks = await res.json()
  return houseworks
}

export const getAllHouseworkIds = async () => {
  const res = await fetch(
    new URL(
      `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/list-housework/`
    ).toString()
  )
  const houseworks = await res.json()

  return houseworks.map((housework) => {
    return {
      params: {
        id: String(housework.id),
      },
    }
  })
}

export const getHouseworkData = async (id: string): Promise<HOUSEWORK> => {
  const res = await fetch(
    new URL(
      `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/detail-housework/${id}/`
    ).toString()
  )
  const housework = await res.json()
  return housework
}
