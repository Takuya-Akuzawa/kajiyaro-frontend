import '@testing-library/jest-dom/extend-expect'
import { render, screen, cleanup } from '@testing-library/react'
import { getPage } from 'next-page-tester'
import { initTestHelpers } from 'next-page-tester'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

initTestHelpers()

const handlers = [
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

describe(`Housework-page test`, () => {
  it('Should render the list of housework prefetched by getStaticProps', async () => {
    const { page } = await getPage({
      route: '/housework-page',
    })
    render(page)
    expect(await screen.findByText('Housework Page')).toBeInTheDocument()
    expect(screen.getByText('dummy data 1')).toBeInTheDocument()
    expect(screen.getByText('dummy data 2')).toBeInTheDocument()
  })
})
