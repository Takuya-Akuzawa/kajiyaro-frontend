import fetch from 'node-fetch'

export const getAllCategoryData = async () => {
  const res = await fetch(
    new URL(
      `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/list-category/`
    ).toString()
  )
  const categoryList = await res.json()
  return categoryList
}
