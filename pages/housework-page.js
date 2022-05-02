import Layout from "../components/Layout";
import Housework from "../components/Housework";
import { getAllHouseworkData } from "../lib/houseworks";
import useSWR from "swr";
import { useEffect } from "react";


const fetcher = (url) => fetch(url).then((res) => res.json())
const apiUrl = `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/houseworks/`

export default function HouseworkList({ staticHouseworks }) {

  const { data: houseworks, mutate } = useSWR(apiUrl, fetcher, {
    fallbackData: staticHouseworks,
  })

  useEffect(() => {
    mutate()
  }, [])

  return (
    <Layout title="Housework">
      <div>Housework List</div>
      <ul>
        {houseworks &&
          houseworks.map((housework) =>
            <Housework key={housework.id} housework={housework} />)}
      </ul>
    </Layout>
  )
}

export async function getStaticProps() {
  const staticHouseworks = await getAllHouseworkData()

  return {
    props: { staticHouseworks },
    revalidate: 3,
  }
}