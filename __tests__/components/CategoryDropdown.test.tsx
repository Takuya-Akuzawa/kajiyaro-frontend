import '@testing-library/jest-dom/extend-expect'
import { render, screen, cleanup } from '@testing-library/react'
import { initTestHelpers } from 'next-page-tester'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import CategoryDropdown from '../../components/CategoryDropdown'
import userEvent from '@testing-library/user-event'
import StateContextProvider from '../../context/StateContext'
import TaskContextProvider from '../../context/TaskContext'
import { SWRConfig } from 'swr'

initTestHelpers()

const handlers = [
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

describe('Categoryドロップダウンコンポーネントの単体テスト(stateContext使用時)', () => {
  it('APIから取得したCategoryデータリストをもとに、プルダウンがレンダリングされる事', async () => {
    render(
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <CategoryDropdown context={'housework'} />
      </SWRConfig>,
      { wrapper: StateContextProvider }
    )
    await screen.findByText('衣')
    userEvent.selectOptions(screen.getByRole('combobox'), ['1'])
    expect(screen.getByRole('option', { name: '衣' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: '食' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: '住' })).toBeInTheDocument()
  })
})

describe('Categoryドロップダウンコンポーネントの単体テスト(taskContext使用時)', () => {
  it('APIから取得したCategoryデータリストをもとに、プルダウンがレンダリングされる事', async () => {
    render(
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <CategoryDropdown context={'task'} />
      </SWRConfig>,
      { wrapper: TaskContextProvider }
    )
    await screen.findByText('衣')
    userEvent.selectOptions(screen.getByRole('combobox'), ['1'])
    expect(screen.getByRole('option', { name: '衣' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: '食' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: '住' })).toBeInTheDocument()
  })
})
