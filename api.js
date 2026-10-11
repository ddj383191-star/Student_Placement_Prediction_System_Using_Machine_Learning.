import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
})

api.interceptors.request.use((cfg) => {
  const tok = localStorage.getItem('token')
  if (tok) cfg.headers.Authorization = `Bearer ${tok}`
  return cfg
})

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401 && !window.location.pathname.includes('/login')) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (!window.location.pathname.includes('/login')) window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
