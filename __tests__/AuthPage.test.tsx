import { render, screen, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { getPage } from 'next-page-tester'
import { initTestHelpers } from 'next-page-tester'

initTestHelpers()

const handlers = [
  rest.post(
    `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/auth/jwt/create/`,
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json({ access: '123xyz' }))
    }
  ),
  rest.get(
    `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/houseworks/`,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json([
          {
            id: 1,
            housework_name: 'dummy data 1',
            category: {
              id: 1,
              category: '衣',
            },
            description: 'mock api request data 1',
            estimated_time: 5,
            create_user: 1,
          },
          {
            id: 2,
            housework_name: 'dummy data 2',
            category: {
              id: 2,
              category: '食',
            },
            description: 'mock api request data 2',
            estimated_time: 10,
            create_user: 1,
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
})
afterAll(() => {
  server.close()
})

describe('AuthPage Test Cases', () => {
  it('Should route to index-page when login succeeded', async () => {
    const { page } = await getPage({
      route: '/auth-page',
    })
    render(page)
    expect(await screen.findByText('Login Page')).toBeInTheDocument()

    userEvent.type(screen.getByPlaceholderText('Username'), 'test-user')
    userEvent.type(screen.getByPlaceholderText('Password'), 'dummypw')
    userEvent.click(screen.getByText('ログイン'))
    expect(await screen.findByText('Dashboard page')).toBeInTheDocument()
  })
  it('Should not route to index-page when login is failed', async () => {
    server.use(
      rest.post(
        `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/auth/jwt/create/`,
        (req, res, ctx) => {
          return res(ctx.status(400))
        }
      )
    )
    const { page } = await getPage({
      route: '/auth-page',
    })
    render(page)
    expect(await screen.findByText('Login Page')).toBeInTheDocument()
    userEvent.type(screen.getByPlaceholderText('Username'), 'test-user')
    userEvent.type(screen.getByPlaceholderText('Password'), 'dummypw')
    userEvent.click(screen.getByText('ログイン'))
    expect(await screen.findByText('ログインに失敗しました'))
    expect(screen.getByText('Login Page')).toBeInTheDocument()
    expect(screen.queryByText('Dashboard Page')).toBeNull()
  })
})
