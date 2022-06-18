import { useContext } from 'react'
import { CATEGORY } from '../types/Types'
import { StateContext } from '../context/StateContext'
import useSWR from 'swr'
import fetch from 'node-fetch'

const CategoryDropdown: React.FC = () => {
  const { selectedHousework, setSelectedHousework } = useContext(StateContext)

  const fetcher = async (url: string): Promise<CATEGORY[]> =>
    await fetch(url).then((res) => res.json())

  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/list-category/`,
    fetcher
  )
  // categoryListから引数のｉｄに一致するcategoryデータを検索し該当データを返す
  const findCategory = (id: string): CATEGORY => {
    return data.find((category) => category.id.toString() === id)
  }

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>

  return (
    <div className="pl-4 py-4 mb-3 w-16 text-lg border rounded-md border-indigo-500 bg-purple-50">
      <select
        className="bg-transparent"
        value={selectedHousework.category['id']}
        onChange={(e) =>
          setSelectedHousework({
            ...selectedHousework,
            category: findCategory(e.target.value),
          })
        }
      >
        {data.map((category) => (
          <option key={category.id} value={category.id}>
            {category.category_name}
          </option>
        ))}
      </select>
    </div>
  )
}
export default CategoryDropdown
