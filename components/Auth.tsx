import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Cookie from 'universal-cookie'
import axios from 'axios'

const cookie = new Cookie()

const Auth: React.FC = () => {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/auth/jwt/create/`,
        { username: username, password: password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      if (res.status === 200) {
        const options = { path: '/' }
        cookie.set('access_token', res.data.access, options)
        router.push('/')
      }
    } catch (error) {
      setError('ログインに失敗しました')
    }
  }
  return (
    <section className="p-6 w-4/5 max-w-4xl bg-white rounded-md shadow-md">
      <h2 className="my-3 text-center text-xl font-semibold">Login Page</h2>
      <form onSubmit={login}>
        <input
          className="block text-black px-4 py-2 mb-3 w-3/5 m-auto
                    border border-gray-300 rounded-md
                    focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40
                    focus:outline-none focus:ring"
          type="text"
          required
          placeholder="Username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value)
          }}
        />

        <input
          className="block text-black w-3/5 px-4 py-2 mb-3 m-auto
                    border border-gray-300 rounded-md
                    focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40
                    focus:outline-none focus:ring"
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
          }}
        />
        <div className="flex items-center justify-center flex-col">
          <button
            type="submit"
            disabled={!username || !password}
            className="text-sm px-2 py-1 mt-2 disabled:opacity-40
                      bg-blue-300 hover:bg-blue-400 rounded uppercase"
          >
            ログイン
          </button>
        </div>
      </form>
      {error && <p className="mt-5 text-red-400 text-center">{error}</p>}
    </section>
  )
}
export default Auth
