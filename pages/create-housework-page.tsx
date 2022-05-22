import Layout from '../components/Layout'
import LinkToHousework from '../components/LinkToHousework'
import HouseworkForm from '../components/HouseworkForm'
import StateContextProvider from '../context/StateContext'

export default function CreateHousework() {
  return (
    <StateContextProvider>
      <Layout title="Create Housework">
        <h2 className="my-3 text-center text-xl font-semibold">
          Create Housework
        </h2>

        <HouseworkForm houseworkCreated={null} housework={null} />
        <LinkToHousework />
      </Layout>
    </StateContextProvider>
  )
}