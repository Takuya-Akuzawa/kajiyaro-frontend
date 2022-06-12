import { createContext, useState } from 'react'
import { HOUSEWORK } from '../types/Types'

export const StateContext = createContext(
  {} as {
    selectedHousework: HOUSEWORK
    setSelectedHousework: React.Dispatch<React.SetStateAction<HOUSEWORK>>
  }
)

const StateContextProvider: React.FC = ({ children }) => {
  const [selectedHousework, setSelectedHousework] = useState({
    id: 0,
    housework_name: '',
    category: {
      id: 1,
      category: '衣',
    },
    description: '',
    estimated_time: 0,
    create_user: {
      id: 1,
      username: 'Dummy User 1',
    },
  })

  return (
    <StateContext.Provider value={{ selectedHousework, setSelectedHousework }}>
      {children}
    </StateContext.Provider>
  )
}
export default StateContextProvider
