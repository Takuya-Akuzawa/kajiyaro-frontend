import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router'
import Cookie from 'universal-cookie'

const cookie = new Cookie()

const Logout: React.FC = () => {
  const router = useRouter()

  const logout = (e) => {
    e.preventDefault()
    cookie.remove('access_token')
    router.push('/auth-page')
  }

  return (
    <button
      type="button"
      onClick={logout}
      className="text-gray-300 hover:bg-gray-700 hover:text-white 
                    px-3 py-2 rounded-md text-sm font-medium"
    >
      Logout
    </button>
  )
}

export default Logout
