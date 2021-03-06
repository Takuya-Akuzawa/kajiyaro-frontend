import { useContext } from 'react'
import useSWR from 'swr'
import { StateContext } from '../context/StateContext'
import { TaskContext } from '../context/TaskContext'
import { USER } from '../types/Types'
import fetch from 'node-fetch'

interface props {
  context: string
}
const UserDropdown: React.FC<props> = ({ context }) => {
  const { selectedHousework, setSelectedHousework } = useContext(StateContext)
  const { selectedTask, setSelectedTask } = useContext(TaskContext)

  const fetcher = async (url: string): Promise<USER[]> =>
    await fetch(url).then((res) => res.json())

  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/list-user/`,
    fetcher
  )
  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>

  const findUser = (id: string): USER => {
    return data.find((user) => user.id.toString() === id)
  }

  if (context === 'housework') {
    return (
      <div>
        <select
          required
          value={selectedHousework.create_user['id']}
          onChange={(e) =>
            setSelectedHousework({
              ...selectedHousework,
              create_user: findUser(e.target.value),
            })
          }
        >
          <option value="0" disabled>
            --担当者を選択してください--
          </option>

          {data.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>
      </div>
    )
  } else if (context === 'task') {
    return (
      <div>
        <select
          className="block text-black text-center w-full px-4 py-2 mb-3
                     border border-gray-300 rounded-md
                    focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40
                    focus:outline-none focus:ring"
          required
          value={selectedTask.assigned_user['id']}
          onChange={(e) =>
            setSelectedTask({
              ...selectedTask,
              assigned_user: findUser(e.target.value),
            })
          }
        >
          <option value="0" disabled>
            --担当者を選択してください--
          </option>

          {data.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>
      </div>
    )
  } else {
    return <div>props invalid</div>
  }
}

export default UserDropdown
