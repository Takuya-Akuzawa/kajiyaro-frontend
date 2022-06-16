import '@testing-library/jest-dom/extend-expect'
import { render, screen, cleanup } from '@testing-library/react'
import { initTestHelpers } from 'next-page-tester'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import CategoryDropdown from '../components/CategoryDropdown'
import userEvent from '@testing-library/user-event'
import StateContextProvider from '../context/StateContext'
import { debug } from 'console'

initTestHelpers()

const handlers = [
  rest.get(
    `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/list-category/`,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json([
          { id: 1, category_name: 'test category 1' },
          { id: 2, category_name: 'test category 2' },
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

describe('Categoryドロップダウンコンポーネントの単体テスト', () => {
  it('APIから取得したCategoryデータリストをもとに、プルダウンがレンダリングされる事', () => {
    render(<CategoryDropdown />, { wrapper: StateContextProvider })
    screen.debug()
    userEvent.selectOptions(screen.getByRole('combobox'), ['1'])
    expect(screen.getByRole('option', { name: 'test category 1' })).toBe(true)
  })
})
