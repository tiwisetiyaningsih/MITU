import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import DashboardAdmin from './components/DashboardAdmin'
import SplashScreen from './components/SplashScreen'
import MyProfile from './components/MyProfile'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboardAdmin" element={<DashboardAdmin />} />
        <Route path='/myprofile' element={<MyProfile/>} />
      </Routes>
    </Router>
  )
}

export default App
