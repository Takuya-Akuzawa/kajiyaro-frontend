import Layout from '../components/Layout'
import Housework from '../components/Housework'
import { getAllHouseworkData } from '../lib/houseworks'
import useSWR from 'swr'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { NextPage, GetStaticProps } from 'next'
import { HOUSEWORK } from '../types/Types'
import axios from 'axios'
import Cookie from 'universal-cookie'
import { useRouter } from 'next/router'

const cookie = new Cookie()

const axiosFetcher = async () => {
  const result = await axios.get<HOUSEWORK[]>(
    `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/houseworks/`,
    {
      headers: { Authorization: `JWT ${cookie.get('access_token')}` },
    }
  )
  return result.data
}

interface STATICPROPS {
  staticHouseworks: HOUSEWORK[]
}

const HouseworkList: NextPage<STATICPROPS> = ({ staticHouseworks }) => {
  const router = useRouter()
  const [hasToken, setHasToken] = useState(false)

  const { data: houseworks, mutate } = useSWR('houseworkFetch', axiosFetcher, {
    fallbackData: staticHouseworks,
    revalidateOnMount: true,
  })

  useEffect(() => {
    mutate()
    if (cookie.get('access_token')) {
      setHasToken(true)
    } else {
      // router.push('/auth-page')
    }
  }, [])

  return (
    <Layout title="Housework">
      <div className="text-2xl font-bold text-slate-700 my-6">
        Housework Page
      </div>

      <ul>
        {houseworks &&
          houseworks.map((housework) => (
            <Housework key={housework.id} {...housework} />
          ))}
      </ul>

      {hasToken ? (
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
      ) : (
        <span className="text-red-400">認証が必要です</span>
      )}
    </Layout>
  )
}
export default HouseworkList

export const getStaticProps: GetStaticProps = async () => {
  const staticHouseworks = await getAllHouseworkData()

  return {
    props: { staticHouseworks },
  }
}
