import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Task from '../components/Task'
import { TASK } from '../types/Types'

describe('Task component with given prop', () => {
  let dummyProps: TASK
  beforeEach(() => {
    dummyProps = {
      id: 1,
      task_name: 'dummy task',
      category: {
        id: 1,
        category: '衣',
      },
      status: '未着手',
      assigned_user: 'Dummy Username',
      scheduled_date: '2022/04/26',
      result_date: '2022/04/27',
      result_time: 30,
    }
  })

  it('Should render correctly with given props value', () => {
    render(<Task {...dummyProps} />)
    expect(screen.getByText(dummyProps.task_name)).toBeInTheDocument()
    expect(screen.getByText(dummyProps.scheduled_date)).toBeInTheDocument()
    expect(screen.getByText(dummyProps.assigned_user)).toBeInTheDocument()
  })
})
