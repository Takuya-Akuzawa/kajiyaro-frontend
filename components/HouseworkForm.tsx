import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { StateContext } from '../context/StateContext'
import { HOUSEWORK } from '../types/Types'
import { KeyedMutator } from 'swr'
import fetch from 'node-fetch'
import Cookie from 'universal-cookie'

const cookie = new Cookie()

interface updateHousework {
  houseworkCreated: KeyedMutator<HOUSEWORK>
  housework: HOUSEWORK
}
interface createHousework {
  houseworkCreated: null
  housework: null
}
type ContextHousework = updateHousework | createHousework

const HouseworkForm: React.FC<ContextHousework> = ({
  houseworkCreated,
  housework,
}) => {
  const { selectedHousework, setSelectedHousework } = useContext(StateContext)
  const [hasToken, setHasToken] = useState(false)
  const apiUrl = `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/houseworks/`
  const router = useRouter()

  useEffect(() => {
    if (housework) {
      setSelectedHousework(housework)
    }
    if (cookie.get('access_token')) {
      setHasToken(true)
    }
  }, [])

  const createHousework = async (e) => {
    e.preventDefault()
    try {
      await fetch(`${apiUrl}`, {
        method: 'POST',
        body: JSON.stringify({
          housework_name: selectedHousework.housework_name,
          category: selectedHousework.category['id'],
          description: selectedHousework.description,
          estimated_time: selectedHousework.estimated_time,
          create_user: selectedHousework.create_user['id'],
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${cookie.get('access_token')}`,
        },
      })
      router.push('/housework-page')
    } catch (err) {
      alert(err)
    }
  }

  const updateHousework = async (e) => {
    e.preventDefault()
    try {
      await fetch(`${apiUrl}${selectedHousework.id}/`, {
        method: 'PUT',
        body: JSON.stringify({
          housework_name: selectedHousework.housework_name,
          category: selectedHousework.category['id'],
          description: selectedHousework.description,
          estimated_time: selectedHousework.estimated_time,
          create_user: selectedHousework.create_user['id'],
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${cookie.get('access_token')}`,
        },
      })
      houseworkCreated()
    } catch (err) {
      alert(err)
    }
  }

  const deleteHousework = async (e) => {
    e.preventDefault()
    try {
      await fetch(`${apiUrl}${selectedHousework.id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${cookie.get('access_token')}`,
        },
      })
      router.push('/housework-page')
    } catch (err) {
      alert(err)
    }
  }

  return (
    <section className="p-6 w-4/5 max-w-4xl bg-white rounded-md shadow-md">
      <form
        onSubmit={
          selectedHousework.id !== 0 ? updateHousework : createHousework
        }
      >
        <div className="px-6 py-4 mb-3 w-16 text-lg border rounded-md border-indigo-500 bg-purple-50">
          {selectedHousework.category['category']}
        </div>

        <label htmlFor="housework_name">housework</label>
        <input
          className="block text-black w-full px-4 py-2 mb-3 
                    border border-gray-300 rounded-md
                    focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40
                    focus:outline-none focus:ring"
          type="text"
          id="housework_name"
          value={selectedHousework.housework_name}
          onChange={(e) =>
            setSelectedHousework({
              ...selectedHousework,
              housework_name: e.target.value,
            })
          }
        />

        <label htmlFor="description">description</label>
        <textarea
          className="block text-black w-full px-4 py-2 mb-3 
                    border border-gray-300 rounded-md
                    focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40
                    focus:outline-none focus:ring"
          id="description"
          value={selectedHousework.description}
          onChange={(e) =>
            setSelectedHousework({
              ...selectedHousework,
              description: e.target.value,
            })
          }
        />

        <label htmlFor="estimated_time">標準時間</label>
        <input
          className="block text-black w-full px-4 py-2 mb-3 
                    border border-gray-300 rounded-md
                    focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40
                    focus:outline-none focus:ring"
          type="number"
          id="estimated_time"
          value={selectedHousework.estimated_time}
          min="0"
          onChange={(e) =>
            setSelectedHousework({
              ...selectedHousework,
              estimated_time: Number(e.target.value),
            })
          }
        />

        <div className="flex justify-around">
          {hasToken && (
            // delete button
            <div className="flex cursor-pointer mt-3">
              <svg
                className="w-6 h-6 cursor-pointer"
                data-testid="delete-button"
                onClick={deleteHousework}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
          )}

          {hasToken && (
            // create/update button
            <button
              type="submit"
              className="text-sm px-2 py-1 mt-2
              bg-blue-300 hover:bg-blue-400 rounded uppercase"
            >
              {selectedHousework.id !== 0 ? 'update' : 'create'}
            </button>
          )}
        </div>
      </form>
    </section>
  )
}
export default HouseworkForm
