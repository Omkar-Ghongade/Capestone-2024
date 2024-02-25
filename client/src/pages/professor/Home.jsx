// in home we will display profile only and also add forgot password here only
import React from 'react'
import MainHome from './MainHome'
import ManageApplications from './ManageApplications'
import Navbar from './Navbar'
import PostProject from './PostProject'
import ViewReports from './ViewReports'
import {BrowserRouter, Routes , Route} from 'react-router-dom'

export default function PHome() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<MainHome />} />
        <Route path="/post-project" element={<PostProject />} />
        <Route path="/manage-applications" element={<ManageApplications />} />
        <Route path="/view-reports" element={<ViewReports />} />
      </Routes>
    </BrowserRouter>
  )
}
