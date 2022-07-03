import { TASK } from '../types/Types'
import { TaskContext } from '../context/TaskContext'
import { useContext } from 'react'

interface PROPS {
  task: TASK
}

const Task: React.FC<PROPS> = ({ task }) => {
  const { setSelectedTask, setShowModal } = useContext(TaskContext)
  return (
    <div
      className="shadow-md w-4/5 items-center m-auto
                  mb-3 cursor-pointer border rounded-md border-orange-200"
      onClick={() => {
        setSelectedTask(task)
        setShowModal(true)
      }}
    >
      <div className="py-2 text-center text-gray-700 bg-orange-100">
        <span className="text-2xl font-semibold border-b border-orange-300">
          {task.task_name}
        </span>
      </div>
      <div className="py-1 text-sm text-gray-700 text-center">
        担当 <span className="text-lg">{task.assigned_user['username']}</span>
      </div>
      <div className="py-1 text-sm text-gray-700 text-center">
        対応予定 <span className="text-lg">{task.scheduled_date}</span>
      </div>
      <div className="py-1 text-base text-gray-700 text-center">
        <span>【{task.status}】</span>
      </div>
    </div>
  )
}

export default Task
