import { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api'

const AuthCtx = createContext(null)
export const useAuth = () => useContext(AuthCtx)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) || null } catch { return null }
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('token') && !user) {
      api.get('/auth/me').then((r) => {
        setUser(r.data)
        localStorage.setItem('user', JSON.stringify(r.data))
      }).catch(() => {
        localStorage.removeItem('token')
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const save = (data) => {
    localStorage.setItem('token', data.access_token)
    const u = { role: data.role, full_name: data.full_name }
    localStorage.setItem('user', JSON.stringify(u))
    setUser(u)
  }

  const login = async (email, password) => {
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      save(data)
      return data
    } finally { setLoading(false) }
  }

  const register = async (email, password, full_name) => {
    setLoading(true)
    try {
      const { data } = await api.post('/auth/register', { email, password, full_name })
      save(data)
      return data
    } finally { setLoading(false) }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthCtx.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthCtx.Provider>
  )
}
