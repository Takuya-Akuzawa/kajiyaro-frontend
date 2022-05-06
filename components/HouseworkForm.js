import { useContext } from "react";
import { StateContext } from "../context/StateContext";

export default function HouseworkForm({ houseworkCreated }) {
  const { selectedHousework, setSelectedHousework } = useContext(StateContext)

  const apiUrl = `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/houseworks/`

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
      setSelectedHousework({
        id: 0,
        housework_name: "",
        category: {
          id: 1,
          category: "衣",
        },
        description: "",
        estimated_time: "",
        create_user: 1
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
      setSelectedHousework({
        id: 0,
        housework_name: "",
        category: {
          id: 1,
          category: "衣",
        },
        description: "",
        estimated_time: "",
        create_user: 1
      })
      houseworkCreated()
    } catch (err) {
      alert(err)
    }
  }

  return (
    <div>
      <form onSubmit={selectedHousework.id !== 0 ? update : create}>
        <input
          className="text-black mb-4 px-2 py-1"
          type="text"
          value={selectedHousework.housework_name}
          onChange={(e) =>
            setSelectedHousework({ ...selectedHousework, housework_name: e.target.value })
          }
        />
        <button
          type="submit"
          className="bg-gray-500 ml-2 hover:bg-gray-600 text-sm px-2 py-1 rounded uppercase"
        >
          {selectedHousework.id !== 0 ? "update" : "create"}
        </button>
      </form>
    </div>
  )
}