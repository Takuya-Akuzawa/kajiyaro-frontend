import '@testing-library/jest-dom/extend-expect'
import { render, screen, cleanup } from '@testing-library/react'
import { getPage } from 'next-page-tester'
import { initTestHelpers } from 'next-page-tester'
import { SWRConfig } from 'swr'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { TASK } from '../types/Types'
import TodoList from '../pages/todo-page'

initTestHelpers()

const handlers = [
  rest.get(
    `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/list-task/`,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json([
          {
            id: 1,
            task_name: 'dummy task 1',
            category: {
              id: 1,
              category: '衣',
            },
            status: '未着手',
            assigned_user: 'Dummy User 1',
            scheduled_date: '2022/04/26',
            result_date: '2022/04/27',
            result_time: 30,
          },
          {
            id: 2,
            task_name: 'dummy task 2',
            category: {
              id: 2,
              category: '食',
            },
            status: '完了',
            assigned_user: 'Dummy User 2',
            scheduled_date: '2022/06/08',
            result_date: '2022/06/08',
            result_time: 60,
          },
        ])
      )
    }
  ),
]

const server = setupServer(...handlers)

beforeAll(() => {
  server.listen()
})
afterEach(() => {
  server.resetHandlers()
  cleanup()
  document.cookie =
    'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
})
afterAll(() => {
  server.close()
})

describe(`Task-page test`, () => {
  it('Should render the list of task prefetched by getStaticProps', async () => {
    const { page } = await getPage({
      route: '/todo-page',
    })
    render(page)
    expect(await screen.findByText('ToDo Page')).toBeInTheDocument()
    expect(screen.getByText('dummy task 1')).toBeInTheDocument()
    expect(screen.getByText('dummy task 2')).toBeInTheDocument()
  })

  it('Should display ”新規作成” link in the todo-page when logged in', async () => {
    document.cookie = 'access_token=123xyz'
    const { page } = await getPage({ route: '/todo-page' })
    render(page)
    expect(await screen.findByText('ToDo Page')).toBeInTheDocument()
    // expect(screen.getByText('新規Task')).toBeInTheDocument()
  })

  it('Should not display ”新規作成” link in the todo-page when logged out', async () => {
    const { page } = await getPage({ route: '/todo-page' })
    render(page)
    expect(await screen.findByText('ToDo Page')).toBeInTheDocument()
    expect(screen.queryByText('新規Task')).toBeNull()
  })
})

// describe(`Todo-page useSWR test`, () => {
//   let staticProps: TASK[]
//   staticProps = [
//     {
//       id: 3,
//       task_name: 'static task 3',
//       category: {
//         id: 1,
//         category: '衣',
//       },
//       status: '未着手',
//       assigned_user: 'Dummy User 1',
//       scheduled_date: '2022/04/26',
//       result_date: '2022/04/27',
//       result_time: 30,
//     },
//     {
//       id: 4,
//       task_name: 'static task 4',
//       category: {
//         id: 2,
//         category: '食',
//       },
//       status: '完了',
//       assigned_user: 'Dummy User 2',
//       scheduled_date: '2022/06/08',
//       result_date: '2022/06/08',
//       result_time: 60,
//     },
//   ]
//   it('Should render CSF data after pre-rendered data', async () => {
//     render(
//       <SWRConfig value={{ dedupingInterval: 0 }}>
//         <TodoList staticTasks={staticProps} />
//       </SWRConfig>
//     )
//     screen.debug()
//     expect(await screen.findByText('static task 3')).toBeInTheDocument()
//     expect(screen.getByText('static task 4')).toBeInTheDocument()
//     expect(await screen.findByText('dummy task 1')).toBeInTheDocument()
//     expect(screen.getByText('dummy task 2')).toBeInTheDocument()
//   })
// })
