import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Housework from '../components/Housework'
import { HOUSEWORK } from '../types/Types'

describe('Housework component with given props', () => {
  let dummyProps: HOUSEWORK
  beforeEach(() => {
    dummyProps = {
      id: 1,
      housework_name: 'dummy data 1',
      category: {
        id: 1,
        category: '衣',
      },
      description: 'mock api request data 1',
      estimated_time: 5,
      create_user: 1,
    }
  })
  it('Should render correctly with given props value', () => {
    render(<Housework {...dummyProps} />)
    expect(
      screen.getByText(dummyProps.category['category'])
    ).toBeInTheDocument()
    expect(screen.getByText(dummyProps.housework_name)).toBeInTheDocument()
    expect(
      screen.getByText(`${dummyProps.estimated_time}分`)
    ).toBeInTheDocument()
    // screen.debug()
  })
})
