import { useEffect } from "react";
import Link from "next/link";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import useSWR from "swr";
import { getAllHouseworkIds, getHouseworkData } from "../../lib/houseworks";
import HouseworkForm from "../../components/HouseworkForm";
import StateContextProvider from "../../context/StateContext";

const fetcher = (url) => fetch(url).then((res) => res.json())
const apiUrl = `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/houseworks/`

export default function Housework({ staticHousework, id }) {
  const router = useRouter()
  const { data: housework, mutate } = useSWR(
    `${apiUrl}${id}/`,
    fetcher,
    {
      fallbackData: staticHousework,
    }
  )

  useEffect(() => {
    mutate()
  }, [])

  if (router.isFallback || !housework) {
    return <div>Loading...</div>
  }

  const deleteHousework = async () => {
    await fetch(`${apiUrl}${id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `JWT ${cookie.get("access_token")}`,
      }
    })
    router.push('/housework-page')
  }

  return (
    <StateContextProvider>
      <Layout title={housework.title}>
        <div>{housework.category["category"]}</div>
        <div>{housework.housework_name}</div>
        <div>詳細 {housework.description}</div>
        <div>標準 {housework.estimated_time}分</div>

        <HouseworkForm houseworkCreated={mutate} />

        {/* Housework pageへ戻る */}
        <Link href="/housework-page">
          <div className="flex cursor-pointer mt-3">
            <svg className="w-6 h-6 mr-2"
              fill="none" stroke="currentColor"
              viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
            <span>一覧へ戻る</span>
          </div>
        </Link>

        {/* delete button */}
        <div className="flex cursor-pointer mt-3">
          <svg
            className="w-6 h-6 cursor-pointer"
            onClick={deleteHousework}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>

      </Layout>
    </StateContextProvider>
  )
}


export async function getStaticPaths() {
  const paths = await getAllHouseworkIds()

  return {
    paths,
    fallback: true,
  }
}

export async function getStaticProps({ params }) {
  const staticHousework = await getHouseworkData(params.id)
  return {
    props: {
      id: staticHousework.id,
      staticHousework,
    },
    revalidate: 3,
  }
}