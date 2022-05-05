import { useEffect } from "react";
import Link from "next/link";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import useSWR from "swr";
import { getAllHouseworkIds, getHouseworkData } from "../../lib/houseworks";


const fetcher = (url) => fetch(url).then((res) => res.json())

export default function Housework({ staticHousework, id }) {
  const router = useRouter()
  const { data: housework, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/houseworks/${id}/`,
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

  return (
    <Layout title={housework.title}>
      <div>{housework.category["category"]}</div>
      <div>{housework.housework_name}</div>
      <div>詳細 {housework.description}</div>
      <div>標準 {housework.estimated_time}分</div>
      <Link href="/housework-page">
        <div>一覧へ</div>
      </Link>
    </Layout>
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