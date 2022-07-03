import '@testing-library/jest-dom/extend-expect'
import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import { getPage } from 'next-page-tester'
import { initTestHelpers } from 'next-page-tester'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import userEvent from '@testing-library/user-event'

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

describe('create-task-page.tsxのページテスト', () => {
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
    result_date: null,
    result_time: null,
  }
  it('Task登録ページへアクセスでき、フォーム入力・登録ボタン実行が成功する事', async () => {
    document.cookie = 'access_token=123xyz'
    const { page } = await getPage({ route: '/create-task-page' })
    render(page)

    // ページタイトルが表示されている事
    expect(await screen.findByText('Register Task')).toBeInTheDocument()
    // 各入力フォームに入力できる事
    userEvent.type(screen.getByPlaceholderText('タスク名'), inputTask.task_name)
    expect(screen.getByDisplayValue(inputTask.task_name)).toBeInTheDocument()

    // Categoryドロップダウンのfetchができるまで待つ
    await screen.findByText('衣')
    userEvent.selectOptions(screen.getByDisplayValue('衣'), ['1'])

    userEvent.clear(screen.getByPlaceholderText('ステータス'))
    userEvent.type(screen.getByPlaceholderText('ステータス'), inputTask.status)
    expect(screen.getByDisplayValue(inputTask.status)).toBeInTheDocument()

    await screen.findByText(/担当者/)
    userEvent.selectOptions(
      screen.getByDisplayValue(/担当者/),
      inputTask.assigned_user['id'].toString()
    )

    fireEvent.change(screen.getByPlaceholderText('対応予定日'), {
      target: { value: inputTask.scheduled_date },
    })

    // 正しいInputデータ入力後、登録buttonが活性化されクリックすると登録が完了した旨メッセージが表示される事
    const createButton = screen.getByText('登録')
    expect(createButton).toBeEnabled()
    userEvent.click(createButton)
    expect(
      await screen.findByText('新規タスクを登録しました')
    ).toBeInTheDocument()
  })

  it('Task登録ページへアクセスでき、ToDoページへ戻れる事', async () => {
    document.cookie = 'access_token=123xyz'
    const { page } = await getPage({ route: '/create-task-page' })
    render(page)
    userEvent.click(screen.getByText('ToDoページへ戻る'))
    expect(await screen.findByText('ToDo')).toBeInTheDocument()
  })
})
