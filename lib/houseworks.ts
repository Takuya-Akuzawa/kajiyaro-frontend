export async function getAllHouseworkData() {
  const res = await fetch(
    new URL(`${process.env.NEXT_PUBLIC_RESTAPI_URL}api/houseworks/`).toString()
  )
  const houseworks = await res.json()
  return houseworks
}

export async function getAllHouseworkIds() {
  const res = await fetch(
    new URL(`${process.env.NEXT_PUBLIC_RESTAPI_URL}api/houseworks/`).toString()
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

export async function getHouseworkData(id: string) {
  const res = await fetch(
    new URL(
      `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/houseworks/${id}/`
    ).toString()
  )
  const housework = await res.json()
  return housework
}
