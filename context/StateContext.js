import { createContext, useState } from 'react'

export const StateContext = createContext()

export default function StateContextProvider(props) {
  const [selectedHousework, setSelectedHousework] = useState(
    {
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
  return (
    <StateContext.Provider value={{ selectedHousework, setSelectedHousework, }}>
      {props.children}
    </StateContext.Provider>
  )
}