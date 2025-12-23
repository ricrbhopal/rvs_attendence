import React from 'react'
import { BrowserRouter, Route, Routes} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/dashboard/Dashboard'
import AttendanceSheet from './pages/dashboard/AttendanceSheet'
import { Toaster } from 'react-hot-toast'

const App = () => {
  return (
    <>
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/dashboard' element={<Dashboard />}/>
        <Route path='/attendance/:teacherId' element={<AttendanceSheet />}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App