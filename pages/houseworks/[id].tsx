import { useEffect } from 'react'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import axios from 'axios'
import { getAllHouseworkIds, getHouseworkData } from '../../lib/houseworks'
import Layout from '../../components/Layout'
import LinkToHousework from '../../components/LinkToHousework'
import HouseworkForm from '../../components/HouseworkForm'
import StateContextProvider from '../../context/StateContext'
import { GetStaticProps, GetStaticPaths, NextPage } from 'next'
import { HOUSEWORK } from '../../types/Types'

const fetcher = (url: string) => fetch(url).then((res) => res.json())
const apiUrl = `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/houseworks/`

// const axiosFetcher = async (id: string) => {
//   const result = await axios.get<HOUSEWORK>(
//     `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/houseworks/${id}/`
//   )
//   return result.data
// }

interface STATICPROPS {
  id: string
  staticHousework: HOUSEWORK
}

const HouseworkDetail: NextPage<STATICPROPS> = ({ id, staticHousework }) => {
  const router = useRouter()
  const { data: housework, mutate } = useSWR(`${apiUrl}${id}/`, fetcher, {
    fallbackData: staticHousework,
  })

  useEffect(() => {
    mutate()
  }, [])

  if (router.isFallback || !housework) {
    return <div>{'Loading'}</div>
  }

  return (
    <StateContextProvider>
      <Layout title="Detail">
        <h2 className="my-3 text-center text-xl font-semibold">
          {'Housework Detail'}
        </h2>

        <HouseworkForm houseworkCreated={mutate} housework={housework} />

        <LinkToHousework />
      </Layout>
    </StateContextProvider>
  )
}
export default HouseworkDetail

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await getAllHouseworkIds()

  return {
    paths,
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const staticHousework = await getHouseworkData(ctx.params.id as string)
  return {
    props: {
      id: staticHousework.id,
      staticHousework,
    },
    revalidate: 3,
  }
}
