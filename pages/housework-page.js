import Layout from "../components/Layout";
import Housework from "../components/Housework";
import { getAllHouseworkData } from "../lib/houseworks";

export default function HouseworkList({ houseworks }) {
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
  const houseworks = await getAllHouseworkData()

  return {
    props: { houseworks }
  }
}