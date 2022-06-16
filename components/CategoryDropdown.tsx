import { useContext, useEffect, useState } from 'react'
import { CATEGORY } from '../types/Types'
import { StateContext } from '../context/StateContext'
import { getAllCategoryData } from '../lib/category'

const CategoryDropdown: React.FC = () => {
  const { selectedHousework, setSelectedHousework } = useContext(StateContext)
  const [categoryList, setCategoryList] = useState<CATEGORY[]>([])

  useEffect(() => {
    // let abortCtrl = new AbortController()
    getAllCategoryData()
      .then((res) => setCategoryList(res))
      .catch((error) => console.error(error))
    // return () => {
    //   abortCtrl.abort()
    // }
  }, [])

  // categoryListから引数のｉｄに一致するcategoryデータを検索し該当データを返す
  const findCategory = (id: string) => {
    return categoryList.find((category) => category.id.toString() === id)
  }

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
        {categoryList.map((category) => (
          <option key={category.id} value={category.id}>
            {category.category_name}
          </option>
        ))}
      </select>
    </div>
  )
}
export default CategoryDropdown
