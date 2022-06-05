import '@testing-library/jest-dom/extend-expect'
import { render, screen, cleanup } from '@testing-library/react'
import { getPage } from 'next-page-tester'
import { initTestHelpers } from 'next-page-tester'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import userEvent from '@testing-library/user-event'

initTestHelpers()

const handlers = [
  rest.get(
    `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/list-housework/`,
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
  rest.post(
    `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/houseworks/`,
    (req, res, ctx) => {
      return res(ctx.status(201))
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

describe(`crete-housework-pate.tsx test`, () => {
  it('Should create new housework data and route to Housework-page', async () => {
    document.cookie = 'access_token=123xyz'
    const { page } = await getPage({ route: '/create-housework-page' })
    render(page)
    expect(await screen.findByText('Create Housework')).toBeInTheDocument()
    userEvent.type(screen.getByLabelText('housework'), 'test create')
    userEvent.type(
      screen.getByLabelText('description'),
      'test create by msw put mocking.'
    )
    userEvent.type(screen.getByLabelText('標準時間'), '10')
    userEvent.click(screen.getByText('create'))
    expect(await screen.findByText('Housework Page')).toBeInTheDocument()
  })
})
