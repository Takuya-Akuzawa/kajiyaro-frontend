import Dashboard from '../components/Dashboard'
import Layout from '../components/Layout'
import { NextPage } from 'next'
import Cookie from 'universal-cookie'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

const cookie = new Cookie()

const Home: NextPage = () => {
  const router = useRouter()
  const [hasToken, setHasToken] = useState(false)

  useEffect(() => {
    if (cookie.get('access_token')) {
      setHasToken(true)
    } else {
      // router.push('/auth-page')
    }
  }, [])

  return (
    <Layout title="Dashboard">
      <Dashboard />
    </Layout>
  )
}
export default Home
