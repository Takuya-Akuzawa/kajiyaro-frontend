import '@testing-library/jest-dom/extend-expect'
import { render, screen, cleanup } from '@testing-library/react'
import { SWRConfig } from 'swr'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { HOUSEWORK } from '../types/Types'
import HouseworkList from '../pages/housework-page'

const server = setupServer(
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
              category_name: '衣',
            },
            description: 'mock api request data 1',
            estimated_time: 5,
            create_user: {
              id: 1,
              username: 'Dummy User 1',
            },
          },
          {
            id: 2,
            housework_name: 'dummy data 2',
            category: {
              id: 2,
              category_name: '食',
            },
            description: 'mock api request data 2',
            estimated_time: 10,
            create_user: {
              id: 1,
              username: 'Dummy User 1',
            },
          },
        ])
      )
    }
  )
)

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

describe(`Housework-page useSWR test`, () => {
  let staticProps: HOUSEWORK[]
  staticProps = [
    {
      id: 3,
      housework_name: 'static data 3',
      category: {
        id: 1,
        category_name: '衣',
      },
      description: 'mock api request data 3',
      estimated_time: 15,
      create_user: {
        id: 1,
        username: 'Dummy User 1',
      },
    },
    {
      id: 4,
      housework_name: 'static data 4',
      category: {
        id: 3,
        category_name: '住',
      },
      description: 'mock api request data 4',
      estimated_time: 40,
      create_user: {
        id: 1,
        username: 'Dummy User 1',
      },
    },
  ]
  it('Should render CSF data after pre-rendered data', async () => {
    render(
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <HouseworkList staticHouseworks={staticProps} />
      </SWRConfig>
    )
    expect(await screen.findByText('static data 3')).toBeInTheDocument()
    expect(screen.getByText('static data 4')).toBeInTheDocument()
    expect(await screen.findByText('dummy data 1')).toBeInTheDocument()
    expect(screen.getByText('dummy data 2')).toBeInTheDocument()
  })
})
