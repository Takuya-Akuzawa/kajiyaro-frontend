import Layout from '../components/Layout'
import { NextPage } from 'next'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Cookie from 'universal-cookie'

const cookie = new Cookie()

const TodoList: NextPage = () => {
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
    <Layout title="ToDo">
      <div>ToDo List</div>
    </Layout>
  )
}
export default TodoList
