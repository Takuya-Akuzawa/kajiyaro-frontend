import Layout from '../components/Layout'
import TaskForm from '../components/TaskForm'
import { TaskContextProvider } from '../context/TaskContext'
import { NextPage } from 'next'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import Cookie from 'universal-cookie'

const cookie = new Cookie()

const CreateTask: NextPage = () => {
  const [hasToken, setHasToken] = useState(false)

  useEffect(() => {
    if (cookie.get('access_token')) {
      setHasToken(true)
    }
  }, [])

  return (
    <TaskContextProvider>
      <Layout title="新規Task">
        <h2 className="my-3 text-center text-xl font-semibold">
          Register Task
        </h2>
        <TaskForm />
        <Link href="/todo-page">
          <a>ToDoページへ戻る</a>
        </Link>
      </Layout>
    </TaskContextProvider>
  )
}
export default CreateTask
