import { createContext, useState } from 'react'
import { TASK } from '../types/Types'

export const TaskContext = createContext(
  {} as {
    selectedTask: TASK
    setSelectedTask: React.Dispatch<React.SetStateAction<TASK>>
    showModal: Boolean
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  }
)

export const TaskContextProvider: React.FC = ({ children }) => {
  const [selectedTask, setSelectedTask] = useState({
    id: 0,
    task_name: '',
    category: {
      id: 1,
      category_name: '衣',
    },
    status: '未着手',
    assigned_user: {
      id: 0,
      username: '未設定',
    },
    scheduled_date: '',
    result_date: undefined,
    result_time: 0,
  })
  const [showModal, setShowModal] = useState(false)

  return (
    <TaskContext.Provider
      value={{ selectedTask, setSelectedTask, showModal, setShowModal }}
    >
      {children}
    </TaskContext.Provider>
  )
}
export default TaskContextProvider
