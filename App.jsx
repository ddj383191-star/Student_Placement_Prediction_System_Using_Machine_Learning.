import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/student/Dashboard'
import Profile from './pages/student/Profile'
import Predict from './pages/student/Predict'
import SkillGap from './pages/student/SkillGap'
import WhatIf from './pages/student/WhatIf'
import History from './pages/student/History'
import AdminDashboard from './pages/admin/AdminDashboard'
import Students from './pages/admin/Students'
import Analytics from './pages/admin/Analytics'
import ModelPerformance from './pages/admin/ModelPerformance'

function Guard({ roles, children }) {
  const { user } = useAuth()
  const token = localStorage.getItem('token')
  if (!token || !user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/app'} replace />
  }
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/app" element={<Guard roles={['student', 'admin']}><Layout mode="student" /></Guard>}>
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="predict" element={<Predict />} />
        <Route path="skill-gap" element={<SkillGap />} />
        <Route path="what-if" element={<WhatIf />} />
        <Route path="history" element={<History />} />
      </Route>

      <Route path="/admin" element={<Guard roles={['admin']}><Layout mode="admin" /></Guard>}>
        <Route index element={<AdminDashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="model" element={<ModelPerformance />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
