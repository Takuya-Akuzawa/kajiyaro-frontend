export default function Housework({ housework }) {
  return (
    <div>
      <span>{housework.id}</span>
      {" : "}
      <span className="cursor-pointer text-gray-700 border-b border-gray-500">
        {housework.housework_name}
      </span>
    </div>
  )
}