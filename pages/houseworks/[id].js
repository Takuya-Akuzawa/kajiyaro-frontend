import { useEffect } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import { getAllHouseworkIds, getHouseworkData } from "../../lib/houseworks";
import Layout from "../../components/Layout";
import LinkToHousework from "../../components/LinkToHousework";
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

  return (
    <StateContextProvider>
      <Layout title={housework.title}>

        <h2 className="mb-3 text-center text-xl font-semibold">Housework Detail</h2>

        <HouseworkForm houseworkCreated={mutate} housework={housework} />

        <LinkToHousework />

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