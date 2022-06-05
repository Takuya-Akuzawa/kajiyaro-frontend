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
  rest.get(
    `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/detail-housework/1/`,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          id: 1,
          housework_name: 'dummy data 1',
          category: {
            id: 1,
            category: '衣',
          },
          description: 'mock api request data 1',
          estimated_time: 5,
          create_user: 1,
        })
      )
    }
  ),
  rest.get(
    `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/detail-housework/2/`,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          id: 2,
          housework_name: 'dummy data 2',
          category: {
            id: 2,
            category: '食',
          },
          description: 'mock api request data 2',
          estimated_time: 10,
          create_user: 1,
        })
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

describe(`housework/[id].js test`, () => {
  it('Should render detailed content of ID 1', async () => {
    const { page } = await getPage({
      route: '/houseworks/1',
    })
    render(page)
    expect(await screen.findByText('Housework Detail')).toBeInTheDocument()
    expect(screen.getByText('衣')).toBeInTheDocument()
    expect(screen.getByDisplayValue('dummy data 1')).toBeInTheDocument()
    expect(
      screen.getByDisplayValue('mock api request data 1')
    ).toBeInTheDocument()
  })
  it('Should render detailed content of ID 2', async () => {
    const { page } = await getPage({
      route: '/houseworks/2',
    })
    render(page)
    expect(await screen.findByText('Housework Detail')).toBeInTheDocument()
    expect(screen.getByText('食')).toBeInTheDocument()
    expect(screen.getByDisplayValue('dummy data 2')).toBeInTheDocument()
    expect(
      screen.getByDisplayValue('mock api request data 2')
    ).toBeInTheDocument()
  })
  it('Should route back to Housework-page from detail page', async () => {
    const { page } = await getPage({
      route: '/houseworks/2',
    })
    render(page)
    await screen.findByText('Housework')
    userEvent.click(screen.getByTestId('back-housework'))
    expect(await screen.findByText('Housework Page')).toBeInTheDocument()
  })

  it('Should render delete/update button when logged in ', async () => {
    document.cookie = 'access_token=123xyz'
    const { page } = await getPage({ route: '/houseworks/1' })
    render(page)
    expect(await screen.findByText('Housework Detail')).toBeInTheDocument()
    expect(screen.getByText('update')).toBeInTheDocument()
    expect(screen.getByTestId('delete-button')).toBeInTheDocument()
  })
  it('Should not render delete/update button when logged out ', async () => {
    const { page } = await getPage({ route: '/houseworks/1' })
    render(page)
    expect(await screen.findByText('Housework Detail')).toBeInTheDocument()
    expect(screen.queryByText('update')).toBeNull()
    expect(screen.queryByTestId('delete-button')).toBeNull()
  })
})
