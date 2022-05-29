import Dashboard from '../components/Dashboard'
import Layout from '../components/Layout'
import { NextPage } from 'next'
import Cookie from 'universal-cookie'
import { useState } from 'react'

const cookie = new Cookie()

const Home: NextPage = () => {
  const [hadToken, setHasToken] = useState(false)
  return (
    <Layout title="Dashboard">
      <Dashboard />
    </Layout>
  )
}
export default Home
