import { TASK } from '../types/Types'

const Task: React.FC<TASK> = ({
  task_name,
  scheduled_date,
  assigned_user,
  status,
}) => {
  return (
    <div
      className="shadow-md w-4/5 items-center m-auto
                  mb-3 cursor-pointer border rounded-md border-slate-300"
    >
      <div className="py-2 text-center text-gray-700">
        <span className="text-xl font-semibold border-b border-gray-500">
          {task_name}
        </span>
      </div>
      <div className="py-1 text-sm text-gray-700 text-center">
        担当 <span className="text-lg">{assigned_user}</span>
      </div>
      <div className="py-1 text-sm text-gray-700 text-center">
        対応予定 <span className="text-lg">{scheduled_date}</span>
      </div>
      <div className="py-1 text-base text-gray-700 text-center">
        <span>【{status}】</span>
      </div>
    </div>
  )
}

export default Task
