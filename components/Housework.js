import Link from "next/link";
import { useContext } from "react";
import { StateContext } from "../context/StateContext";


export default function Housework({ housework }) {
  const { setSelectedHousework } = useContext(StateContext)

  return (
    // card component
    <Link href={`/houseworks/${housework.id}/`}>
      <div
        className="mb-3 cursor-pointer border rounded-md border-indigo-500
        bg-white flex items-center shadow-md"
        onClick={() => setSelectedHousework(housework)}
      >

        <div className="px-6 py-4 border-r rounded-md border-indigo-500 bg-purple-50">
          <span className="text-lg">
            {housework.category["category"]}
          </span>
        </div>

        <div className="w-60 py-2 text-center">
          <span className="text-lg font-semibold text-gray-700 border-b border-gray-500">
            {housework.housework_name}
          </span>
        </div>

        <div className="px-4 py-2 text-center">
          <div className="text-xs text-slate-500">標準</div>
          <div className="text-sm">{`${housework.estimated_time}分`}</div>
        </div>

      </div>
    </Link>
  )
}