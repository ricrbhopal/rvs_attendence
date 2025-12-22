import React from 'react'
import { BrowserRouter, Route, Routes} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/dashboard/Dashboard'
import AttendanceSheet from './pages/dashboard/AttendanceSheet'

const App = () => {
  return (
    <>
    <BrowserRouter>
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