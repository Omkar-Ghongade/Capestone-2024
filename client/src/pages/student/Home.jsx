// in home we will display profile only and also add forgot password here only
import React from 'react'
import AppliedProjects from './AppliedProjects'
import ProfessorProfiles from './ProfessorProfiles'
import ProjectsList from './ProjectsList'
import SubmitReports from './SubmitReports'
import MyProjects from './MyProjects'
import Navbar from './Navbar'
import MainHome from './MainHome'
import {BrowserRouter, Routes , Route} from 'react-router-dom'

export default function SHome() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<MainHome />} />
        <Route path="/applied-projects" element={<AppliedProjects />} />
        <Route path="/professor-profiles" element={<ProfessorProfiles />} />
        <Route path="/projects-list" element={<ProjectsList />} />
        <Route path="/submit-reports" element={<SubmitReports />} />
        <Route path="/my-projects" element={<MyProjects />} />
      </Routes>
    </BrowserRouter>
  )
}
