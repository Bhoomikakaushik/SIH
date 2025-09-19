import React from 'react'
import Navbar from './components/Navbar'
import { Routes, Route } from 'react-router-dom'
import LoginPage from './components/Login'
import SignUpPage from './components/SignUp'
import ProfilePage from './components/Profile'
import Chatbot from './components/Chatbot'
import Discover from './components/Discover'
// import Dashboard2 from './components/Dashboard2'
import Dashboard from './components/Dashboard'
import Home from './components/Home'
import AdminDashboard from './components/Admin/Admin'
import ProtectedRoute from './ProtectedRoute'
const App = () => {
  return (
    <div>
      {/* <Navbar/> */}
      <main>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/Login' element={<LoginPage/>}/>
          <Route path='/SignUp' element={<SignUpPage/>}/>
          <Route path='/profile' element={<ProtectedRoute><ProfilePage/></ProtectedRoute>}/>
          <Route path='/SmartAssistant' element={<ProtectedRoute><Chatbot/></ProtectedRoute>}/>
          <Route path='/Discover' element={<ProtectedRoute><Discover/></ProtectedRoute>}/>
          <Route path='/Dashboard' element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
          <Route path='/AdminDashboard' element={<AdminDashboard/>}/>
        </Routes>
      </main>
    </div>
  )
}

export default App
