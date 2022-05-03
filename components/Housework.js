export default function Housework({ housework }) {
  return (
    <div
      className="cursor-pointer border rounded-md mb-3
                border-indigo-400  flex justify-items-center items-center contents-center ">
      <div className="px-7 py-5 border-r  border-indigo-300 w-auto">{housework.category}</div>
      <div className="w-60 py-2 text-center">
        <span className="text-lg font-semibold text-gray-700 align-middle border-b border-gray-500">
          {housework.housework_name}
        </span>
      </div>
      <div className="pr-4">
        <div className="text-sm">{"標準"}</div>
        <div className="text-sm">{housework.estimated_time}分</div>
      </div>
    </div>
  )
}