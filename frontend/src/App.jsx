import React from 'react'
import Login from "./pages/Login.jsx"
import Signup from './pages/Signup.jsx'
import VerifyOtp from './pages/verifyOtp.jsx'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
export default function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/verifyOtp" element={<VerifyOtp/>}/>
        </Routes>
    </BrowserRouter>
  )
}
