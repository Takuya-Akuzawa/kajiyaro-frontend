import '@testing-library/jest-dom/extend-expect'
import { render, screen, cleanup } from '@testing-library/react'
import { initTestHelpers } from 'next-page-tester'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import UserDropdown from '../../components/UserDropdown'
import StateContextProvider from '../../context/StateContext'
import TaskContextProvider from '../../context/TaskContext'
import { SWRConfig } from 'swr'
import userEvent from '@testing-library/user-event'

initTestHelpers()

const handlers = [
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

describe('Userドロップダウンコンポーネントの単体テスト(stateContext使用時)', () => {
  it('APIから取得したUserデータリストをもとに、プルダウンがレンダリングされる事', async () => {
    render(
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <UserDropdown context={'housework'} />
      </SWRConfig>,
      { wrapper: StateContextProvider }
    )

    await screen.findByText('ユーザを選択してください')
    userEvent.selectOptions(screen.getByRole('combobox'), ['1'])
    expect(screen.getByRole('option', { name: 'Takuya' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Narumi' })).toBeInTheDocument()
  })
})

describe('Userドロップダウンコンポーネントの単体テスト(taskContext使用時)', () => {
  it('APIから取得したUserデータリストをもとに、プルダウンがレンダリングされる事', async () => {
    render(
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <UserDropdown context={'task'} />
      </SWRConfig>,
      { wrapper: TaskContextProvider }
    )

    await screen.findByText('ユーザを選択してください')
    userEvent.selectOptions(screen.getByRole('combobox'), ['1'])
    expect(screen.getByRole('option', { name: 'Takuya' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Narumi' })).toBeInTheDocument()
  })
})
