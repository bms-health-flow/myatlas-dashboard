import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Dashboard from './pages/Dashboard'
import VitalSign from './pages/VitalSign'
import HomeVisit from './pages/HomeVisit'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import PageTransition from './components/PageTransition'

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [initialRole, setInitialRole] = useState('admin')

  const handleLogin = (role) => {
    setInitialRole(role)
    setLoggedIn(true)
  }

  const handleLogout = () => {
    setLoggedIn(false)
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          loggedIn ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />
        } />
        <Route path="/" element={
          loggedIn ? <MainLayout initialRole={initialRole} onLogout={handleLogout} /> : <Navigate to="/login" replace />
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
          <Route path="vitalsign" element={<PageTransition><VitalSign /></PageTransition>} />
          <Route path="homevisit" element={<PageTransition><HomeVisit /></PageTransition>} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
