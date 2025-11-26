import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import DashboardAdmin from './components/DashboardAdmin'
import SplashScreen from './components/SplashScreen'
import MyProfile from './components/MyProfile'
import Kegiatan from './components/Kegiatan'
import UsersAdmin from './components/UsersAdmin'

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
        <Route path='/admin/kegiatan' element={<Kegiatan/>} />
        <Route path='/admin/users' element={<UsersAdmin/>} />
      </Routes>
    </Router>
  )
}

export default App
