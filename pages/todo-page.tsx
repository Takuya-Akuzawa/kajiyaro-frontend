import { useState, useEffect, useContext } from 'react'
import useSWR from 'swr'
import { NextPage, GetStaticProps } from 'next'
import Cookie from 'universal-cookie'
import { TASK } from '../types/Types'
import Layout from '../components/Layout'
import Task from '../components/Task'
import { getAllTaskData } from '../lib/tasks'
import axios from 'axios'
import Link from 'next/link'
import Modal from '../components/Modal'
import { TaskContextProvider } from '../context/TaskContext'

const cookie = new Cookie()

const axiosFetcher = async () => {
  const result = await axios.get<TASK[]>(
    `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/list-task/`
  )
  return result.data
}

interface STATICPROPS {
  staticTasks: TASK[]
}

const TodoList: NextPage<STATICPROPS> = ({ staticTasks }) => {
  // const router = useRouter()
  const [hasToken, setHasToken] = useState(false)

  const { data: tasks, mutate } = useSWR('taskFetch', axiosFetcher, {
    fallbackData: staticTasks,
    revalidateOnMount: true,
  })

  useEffect(() => {
    mutate()
    if (cookie.get('access_token')) {
      setHasToken(true)
    } else {
      // router.push('/auth-page')
    }
  }, [])
  return (
    <TaskContextProvider>
      <Layout title="ToDo">
        <div className="text-2xl font-bold text-slate-700 my-6">ToDo Page</div>
        <section className="p-6 w-4/5 max-w-4xl bg-white rounded-md shadow-md">
          <ul>
            {tasks && tasks.map((task) => <Task key={task.id} task={task} />)}
          </ul>
        </section>
        <Link href="/create-task-page">
          <a>新規Task登録</a>
        </Link>
        <Modal mutate={mutate} />
      </Layout>
    </TaskContextProvider>
  )
}
export default TodoList

export const getStaticProps: GetStaticProps = async () => {
  const staticTasks = await getAllTaskData()

  return {
    props: { staticTasks },
    revalidate: 3,
  }
}
