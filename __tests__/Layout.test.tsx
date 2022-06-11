import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import { getPage } from 'next-page-tester'
import { initTestHelpers } from 'next-page-tester'

initTestHelpers()

describe('Navigation by Link', () => {
  it('Should route to selected page in Navbar', async () => {
    const { page } = await getPage({
      route: '/index',
    })
    render(page)

    userEvent.click(screen.getByTestId('nav-ToDo'))
    expect(await screen.findByText('ToDo List')).toBeInTheDocument()

    userEvent.click(screen.getByTestId('nav-Dashboard'))
    expect(await screen.findByText('Housework')).toBeInTheDocument()
    // screen.debug()
  })
})
