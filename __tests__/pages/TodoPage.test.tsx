import '@testing-library/jest-dom/extend-expect'
import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import { getPage } from 'next-page-tester'
import { initTestHelpers } from 'next-page-tester'
import { SWRConfig } from 'swr'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { TASK } from '../../types/Types'
import TodoList from '../../pages/todo-page'
import userEvent from '@testing-library/user-event'

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
              category_name: '衣',
            },
            status: '未着手',
            assigned_user: {
              id: 1,
              username: 'Takuya',
            },
            scheduled_date: '2022/04/26',
            result_date: '2022/04/27',
            result_time: 30,
          },
          {
            id: 2,
            task_name: 'dummy task 2',
            category: {
              id: 2,
              category_name: '食',
            },
            status: '完了',
            assigned_user: {
              id: 2,
              username: 'Narumi',
            },
            scheduled_date: '2022/06/08',
            result_date: '2022/06/08',
            result_time: 60,
          },
        ])
      )
    }
  ),
  rest.get(
    `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/list-user/`,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json([
          { id: 1, username: 'Takuya' },
          { id: 2, username: 'Narumi' },
        ])
      )
    }
  ),
  rest.put(
    `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/tasks/:id`,
    (req, res, ctx) => {
      return res(ctx.status(200))
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

  const updateTask = {
    task_name: 'お風呂掃除',
    category: {
      id: 3,
      category_name: '住',
    },
    status: '完了',
    assigned_user: {
      id: 2,
      username: 'Narumi',
    },
    scheduled_date: '2022-06-12',
    result_date: '2022-06-12',
    result_time: 10,
  }
  it('フォームの入力内容を変更し、更新ボタン実行が成功する事', async () => {
    document.cookie = 'access_token=123xyz'
    const { page } = await getPage({ route: '/todo-page' })
    render(page)
    expect(await screen.findByText('ToDo Page')).toBeInTheDocument()

    // TaskをクリックするとModalが表示される事
    userEvent.click(screen.getByText('dummy task 1'))
    expect(await screen.findByText('Task更新')).toBeInTheDocument()

    // 各入力フォームに入力できる事
    const taskInput = screen.getByPlaceholderText('タスク名')
    userEvent.clear(taskInput)
    userEvent.type(taskInput, updateTask.task_name)
    expect(screen.getByDisplayValue(updateTask.task_name)).toBeInTheDocument()

    // Categoryドロップダウンのfetchができるまで待つ
    await screen.findByText('衣')
    userEvent.selectOptions(screen.getByDisplayValue('衣'), ['3'])
    expect(
      screen.getByDisplayValue(updateTask.category['category_name'])
    ).toBeInTheDocument()

    // 担当者を変更
    const inputUser = await screen.findByText(/担当者/)
    expect(screen.getByRole('option', { name: 'Takuya' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Narumi' })).toBeInTheDocument()
    // userEvent.selectOptions(inputUser, ['2'])

    // ステータスの入力値をクリアして”完了”にする
    const inputStatus = screen.getByPlaceholderText('ステータス')
    userEvent.clear(inputStatus)
    userEvent.type(inputStatus, updateTask.status)
    expect(screen.getByDisplayValue(updateTask.status)).toBeInTheDocument()

    // 実績日を入力
    fireEvent.change(screen.getByPlaceholderText('実績日'), {
      target: { value: updateTask.scheduled_date },
    })
    expect(screen.getByDisplayValue(updateTask.result_date)).toBeInTheDocument()

    // 実績時間を入力
    const inputResultTime = screen.getByPlaceholderText('実績時間')
    userEvent.clear(inputResultTime)
    userEvent.type(inputResultTime, updateTask.result_time.toString())

    // 更新Buttonが活性化され、更新実行後に更新成功メッセージが表示される事
    const updateButton = screen.getByText('更新')
    expect(updateButton).toBeEnabled()
    userEvent.click(updateButton)
    expect(await screen.findByText('タスクを更新しました')).toBeInTheDocument()
  })

  it('バックエンドのサーバエラー時、更新処理に失敗しその旨メッセージが表示される事', async () => {
    document.cookie = 'access_token=123xyx'
    server.use(
      rest.put(
        `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/tasks/:id`,
        (req, res, ctx) => {
          return res(ctx.status(503))
        }
      )
    )
    document.cookie = 'access_token=123xyz'
    const { page } = await getPage({ route: '/todo-page' })
    render(page)
    expect(await screen.findByText('ToDo Page')).toBeInTheDocument()

    // TaskをクリックするとModalが表示される事
    userEvent.click(screen.getByText('dummy task 1'))
    expect(await screen.findByText('Task更新')).toBeInTheDocument()

    // ステータスの入力値をクリアして”完了”にする
    const inputStatus = screen.getByPlaceholderText('ステータス')
    userEvent.clear(inputStatus)
    userEvent.type(inputStatus, updateTask.status)
    expect(screen.getByDisplayValue(updateTask.status)).toBeInTheDocument()

    // 更新Buttonが活性化され、更新実行後に更新失敗メッセージが表示される事
    const updateButton = screen.getByText('更新')
    expect(updateButton).toBeEnabled()
    userEvent.click(updateButton)
    expect(
      await screen.findByText('タスクの更新に失敗しました')
    ).toBeInTheDocument()
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
