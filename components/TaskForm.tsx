import { useContext, useState, useEffect } from 'react'
import { TaskContext } from '../context/TaskContext'
import Cookie from 'universal-cookie'
import CategoryDropdown from './CategoryDropdown'
import UserDropdown from './UserDropdown'
import axios from 'axios'

const cookie = new Cookie()

const TaskForm: React.FC = () => {
  const { selectedTask, setSelectedTask } = useContext(TaskContext)
  const [hasToken, setHasToken] = useState(false)
  const [message, setMessage] = useState('')
  const apiUrl = `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/tasks/`

  // Cookieの認証トークン確認
  useEffect(() => {
    if (cookie.get('access_token')) {
      setHasToken(true)
    }
  }, [])

  // Taskデータ登録：Contextに保持しているTaskデータからAPIにPOSTリクエストする
  const createTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const res = await axios.post(
        `${apiUrl}`,
        {
          task_name: selectedTask.task_name,
          category: selectedTask.category['id'],
          status: selectedTask.status,
          assigned_user: selectedTask.assigned_user['id'],
          scheduled_date: selectedTask.scheduled_date,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `JWT ${cookie.get('access_token')}`,
          },
        }
      )
      if (res.status === 201) {
        setMessage('新規タスクを登録しました')
      }
    } catch (error) {
      setMessage('タスクの登録に失敗しました')
    }
  }

  return (
    <section className="p-6 w-4/5 max-w-4xl bg-white rounded-md shadow-md">
      <form onSubmit={createTask}>
        <CategoryDropdown context={'task'} />

        <input
          className="block text-black text-center w-full px-4 py-2 mb-3 
          border border-gray-300 rounded-md
          focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40
          focus:outline-none focus:ring"
          type="text"
          required
          placeholder="タスク名"
          value={selectedTask.task_name}
          onChange={(e) =>
            setSelectedTask({ ...selectedTask, task_name: e.target.value })
          }
        />

        <UserDropdown context={'task'} />

        <input
          className="block text-black text-center w-full px-4 py-2 mb-3 
                    border border-gray-300 rounded-md
                    focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40
                    focus:outline-none focus:ring"
          type="text"
          required
          placeholder="ステータス"
          value={selectedTask.status}
          onChange={(e) =>
            setSelectedTask({ ...selectedTask, status: e.target.value })
          }
        />

        <input
          className="block text-black text-center w-full px-4 py-2 mb-3 
          border border-gray-300 rounded-md
          focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40
          focus:outline-none focus:ring"
          type="date"
          required
          placeholder="対応予定日"
          value={selectedTask.scheduled_date}
          onChange={(e) =>
            setSelectedTask({
              ...selectedTask,
              scheduled_date: e.target.value,
            })
          }
        />
        <div className="flex justify-center">
          {hasToken && (
            <button
              type="submit"
              disabled={
                !selectedTask.task_name ||
                !selectedTask.status ||
                !selectedTask.scheduled_date ||
                selectedTask.assigned_user['id'] === 0
              }
              className="text-sm px-2 py-1 mt-2 disabled:opacity-40
              bg-blue-300 hover:bg-blue-400 rounded uppercase"
            >
              {'登録'}
            </button>
          )}
        </div>
      </form>
      {message && <p className="mt-5 text-blue-400 text-center">{message}</p>}
    </section>
  )
}
export default TaskForm
