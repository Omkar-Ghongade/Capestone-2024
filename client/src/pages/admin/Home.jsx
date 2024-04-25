// in home we will display profile only and also add forgot password here only
import React from 'react'
import Navbar from './Navbar'
import MainHome from './MainHome'
import Handleusers from './Handleusers'
import Handlestudents from './Handlestudents'
import Handleprofessors from './Handleprofessors'
import {BrowserRouter, Routes , Route} from 'react-router-dom'

export default function AHome() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<MainHome />} />
        <Route path="/handleusers" element={<Handleusers />} />
        <Route path="/handlestudents" element={<Handlestudents />} />
        <Route path="/handleprofessors" element={<Handleprofessors />} />
      </Routes>
    </BrowserRouter>
  )
}
