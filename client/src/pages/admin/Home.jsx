// in home we will display profile only and also add forgot password here only
import React from 'react'
import Navbar from './Navbar'
import MainHome from './MainHome'
import Overview from './Overview'
import {BrowserRouter, Routes , Route} from 'react-router-dom'

export default function AHome() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<MainHome />} />
        <Route path="/overview" element={<Overview />} />
      </Routes>
    </BrowserRouter>
  )
}
