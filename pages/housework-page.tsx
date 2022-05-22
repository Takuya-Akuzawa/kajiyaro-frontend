import Layout from '../components/Layout'
import Housework from '../components/Housework'
import { getAllHouseworkData } from '../lib/houseworks'
import useSWR from 'swr'
import { useEffect } from 'react'
import Link from 'next/link'
import { NextPage } from 'next'
import { HOUSEWORK } from '../types/Types'

const fetcher = (url) => fetch(url).then((res) => res.json())
const apiUrl = `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/houseworks/`

interface STATICPROPS {
  staticHouseworks: HOUSEWORK[]
}

const HouseworkList: NextPage<STATICPROPS> = ({ staticHouseworks }) => {
  const { data: houseworks, mutate } = useSWR(apiUrl, fetcher, {
    fallbackData: staticHouseworks,
  })

  useEffect(() => {
    mutate()
  }, [])

  return (
    <Layout title="Housework">
      <div className="text-2xl font-bold text-slate-700 my-6">Housework</div>

      <ul>
        {houseworks &&
          houseworks.map((housework) => (
            <Housework key={housework.id} {...housework} />
          ))}
      </ul>

      <Link href="/create-housework-page">
        <div className="flex cursor-pointer mt-3">
          {/* <<アイコン */}
          <svg
            className="w-6 h-6 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
          <span>新規Housework</span>
        </div>
      </Link>
    </Layout>
  )
}
export default HouseworkList

export async function getStaticProps() {
  const staticHouseworks = await getAllHouseworkData()

  return {
    props: { staticHouseworks },
    revalidate: 3,
  }
}
