import { useState, useEffect } from 'react'
// import { useRouter } from 'next/router'
import useSWR from 'swr'
import { NextPage, GetStaticProps } from 'next'
import Cookie from 'universal-cookie'
import { TASK } from '../types/Types'
import Layout from '../components/Layout'
import Task from '../components/Task'
import { getAllTaskData } from '../lib/tasks'
import axios from 'axios'

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
    // revalidateOnMount: true,
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
    <Layout title="ToDo">
      <div>ToDo Page</div>

      <ul>{tasks && tasks.map((task) => <Task key={task.id} {...task} />)}</ul>
    </Layout>
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
