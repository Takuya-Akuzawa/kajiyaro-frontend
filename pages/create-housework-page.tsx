import Layout from '../components/Layout'
import LinkToHousework from '../components/LinkToHousework'
import HouseworkForm from '../components/HouseworkForm'
import StateContextProvider from '../context/StateContext'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Cookie from 'universal-cookie'

const cookie = new Cookie()

export default function CreateHousework() {
  const router = useRouter()
  const [hasToken, setHasToken] = useState(false)

  useEffect(() => {
    if (cookie.get('access_token')) {
      setHasToken(true)
    } else {
      router.push('/auth-page')
    }
  }, [])

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
