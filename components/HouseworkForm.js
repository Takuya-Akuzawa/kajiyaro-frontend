import { useContext, useEffect } from "react";
import { StateContext } from "../context/StateContext";

export default function HouseworkForm({ houseworkCreated, housework }) {
  const { selectedHousework, setSelectedHousework } = useContext(StateContext)

  const apiUrl = `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/houseworks/`

  useEffect(() => {
    setSelectedHousework(housework)
  }, [])

  const create = async (e) => {
    e.preventDefault()
    try {
      await fetch(`${apiUrl}`, {
        method: "POST",
        body: JSON.stringify({
          housework_name: selectedHousework.housework_name,
          category: selectedHousework.category["id"],
          description: selectedHousework.description,
          estimated_time: selectedHousework.estimated_time,
          create_user: selectedHousework.create_user,
        }),
        headers: {
          "Content-Type": "application/json",
          // Authorization: `JWT ${cookie.get("access_token")}`,
        },
      })
      houseworkCreated()
    } catch (err) {
      alert(err)
    }
  }

  const update = async (e) => {
    e.preventDefault()
    try {
      await fetch(`${apiUrl}${selectedHousework.id}/`, {
        method: "PUT",
        body: JSON.stringify({
          housework_name: selectedHousework.housework_name,
          category: selectedHousework.category["id"],
          description: selectedHousework.description,
          estimated_time: selectedHousework.estimated_time,
          create_user: selectedHousework.create_user,
        }),
        headers: {
          "Content-Type": "application/json",
          // Authorization: `JWT ${cookie.get("access_token")}`,
        },
      })
      houseworkCreated()
    } catch (err) {
      alert(err)
    }
  }

  return (
    <section className="p-6 w-4/5 max-w-4xl bg-white rounded-md shadow-md">

      <form onSubmit={selectedHousework.id !== 0 ? update : create}>
        <div className="px-6 py-4 mb-3 w-16 text-lg border rounded-md border-indigo-500 bg-purple-50">
          {selectedHousework.category["category"]}
        </div>

        <label htmlFor="housework_name">housework</label>
        <input
          className="block text-black w-full px-4 py-2 mt-2 
                    border border-gray-300 rounded-md
                    focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40
                    focus:outline-none focus:ring"
          type="text"
          id="housework_name"
          value={selectedHousework.housework_name}
          onChange={(e) =>
            setSelectedHousework({ ...selectedHousework, housework_name: e.target.value })
          }
        />

        <label htmlFor="description">description</label>
        <textarea
          className="block text-black w-full px-4 py-2 mb-2 
                    border border-gray-300 rounded-md
                    focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40
                    focus:outline-none focus:ring"
          type="text"
          id="description"
          value={selectedHousework.description}
          onChange={(e) =>
            setSelectedHousework({ ...selectedHousework, description: e.target.value })
          }
        />

        <label htmlFor="estimated_time">標準時間</label>
        <input
          className="block text-black w-full px-4 py-2 mt-2 
                    border border-gray-300 rounded-md
                    focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40
                    focus:outline-none focus:ring"
          type="text"
          id="estimated_time"
          value={selectedHousework.estimated_time}
          onChange={(e) =>
            setSelectedHousework({ ...selectedHousework, estimated_time: e.target.value })
          }
        />

        <div className="flex justify-end">
          <button
            type="submit"
            className="text-sm px-2 py-1 mt-2
                    bg-blue-300 hover:bg-blue-400 rounded uppercase"
          >
            {selectedHousework.id !== 0 ? "update" : "create"}
          </button>
        </div>
      </form>
    </section>
  )
}