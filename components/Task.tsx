import { TASK } from '../types/Types'

const Task: React.FC<TASK> = ({ task_name, scheduled_date, assigned_user }) => {
  return (
    <div className="bg-white rounded-md shadow-md ">
      <div className="text-lg font-semibold text-center text-gray-700">
        {task_name}
      </div>
      <div className="text-base text-gray-700">
        担当 <span>{assigned_user}</span>
      </div>
      <div className="text-base text-gray-700">
        対応予定 <span>{scheduled_date}</span>
      </div>
    </div>
  )
}

export default Task
