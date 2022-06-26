import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import { initTestHelpers } from 'next-page-tester'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import TaskForm from '../../components/TaskForm'
import { TaskContextProvider } from '../../context/TaskContext'
import { SWRConfig } from 'swr'

initTestHelpers()

const handlers = [
  rest.post(
    `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/tasks/`,
    (req, res, ctx) => {
      return res(ctx.status(201))
    }
  ),
  rest.get(
    `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/list-category/`,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json([
          { id: 1, category_name: '衣' },
          { id: 2, category_name: '食' },
          { id: 3, category_name: '住' },
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

describe('Task登録フォームのコンポーネント単体テスト', () => {
  const inputTask = {
    task_name: '洗濯',
    category: {
      id: 1,
      category_name: '衣',
    },
    status: '未着手',
    assigned_user: {
      id: 2,
      username: 'Takuya',
    },
    scheduled_date: '2022-06-12',
    result_date: undefined,
    result_time: undefined,
  }

  it('フォーム入力欄にTask内容を入力して、登録ボタン実行が成功する事', async () => {
    document.cookie = 'access_token=123xyz'
    render(
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <TaskForm />
      </SWRConfig>,
      { wrapper: TaskContextProvider }
    )

    // フォーム入力前は登録Buttonが非活性になっている事
    const createButton = screen.getByText('登録')
    expect(createButton).toBeDisabled()

    // 各入力フォームに入力できる事
    userEvent.type(screen.getByPlaceholderText('タスク名'), inputTask.task_name)
    expect(screen.getByDisplayValue(inputTask.task_name)).toBeInTheDocument()

    // Categoryドロップダウンのfetchができるまで待つ
    await screen.findByText('衣')
    userEvent.selectOptions(screen.getByDisplayValue('衣'), ['1'])

    userEvent.clear(screen.getByPlaceholderText('ステータス'))
    userEvent.type(screen.getByPlaceholderText('ステータス'), inputTask.status)

    await screen.findByText(/担当者/)
    userEvent.selectOptions(
      screen.getByDisplayValue(/担当者/),
      inputTask.assigned_user['id'].toString()
    )

    fireEvent.change(screen.getByPlaceholderText('対応予定日'), {
      target: { value: inputTask.scheduled_date },
    })

    // 正しいInputデータ入力後、登録buttonが活性化されクリックすると登録が完了した旨メッセージが表示される事
    expect(createButton).toBeEnabled()
    userEvent.click(createButton)
    expect(
      await screen.findByText('新規タスクを登録しました')
    ).toBeInTheDocument()
  })

  it('バックエンドサーバのエラー時、登録処理に失敗しその旨メッセージが表示される事', async () => {
    document.cookie = 'access_token=123xyz'
    server.use(
      rest.post(
        `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/tasks/`,
        (req, res, ctx) => {
          return res(ctx.status(503))
        }
      )
    )

    render(<TaskForm />, { wrapper: TaskContextProvider })

    // 各入力フォームに入力できる事
    userEvent.type(screen.getByPlaceholderText('タスク名'), inputTask.task_name)
    expect(screen.getByDisplayValue(inputTask.task_name)).toBeInTheDocument()

    // Categoryドロップダウンのfetchができるまで待つ
    await screen.findByText('衣')
    userEvent.selectOptions(screen.getByDisplayValue('衣'), ['1'])

    userEvent.clear(screen.getByPlaceholderText('ステータス'))
    userEvent.type(screen.getByPlaceholderText('ステータス'), inputTask.status)

    await screen.findByText(/担当者/)
    userEvent.selectOptions(
      screen.getByDisplayValue(/担当者/),
      inputTask.assigned_user['id'].toString()
    )

    fireEvent.change(screen.getByPlaceholderText('対応予定日'), {
      target: { value: inputTask.scheduled_date },
    })

    // 登録Buttonクリック後、登録失敗した場合その旨メッセージが表示される事
    const createButton = screen.getByText('登録')
    expect(createButton).toBeEnabled()
    userEvent.click(createButton)

    expect(
      await screen.findByText('タスクの登録に失敗しました')
    ).toBeInTheDocument()
  })
})
