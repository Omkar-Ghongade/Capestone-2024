// in home we will display profile only and also add forgot password here only
import React from 'react'
import AppliedProjects from './AppliedProjects'
import ProfessorProfiles from './ProfessorProfiles'
import ProjectsList from './ProjectsList'
import SubmitReports from './SubmitReports'
import TeamFormation from './TeamFormation'
import Navbar from './Navbar'
import MainHome from './MainHome'
import {BrowserRouter, Routes , Route} from 'react-router-dom'


export default function SHome() {
  return (
    <BrowserRouter>
    <div className='flex flex-col'>
      <Navbar/>
      <Routes>
        <Route path="/" element={<MainHome />} />
        <Route path="/applied-projects" element={<AppliedProjects />} />
        <Route path="/professor-profiles" element={<ProfessorProfiles />} />
        <Route path="/projects-list" element={<ProjectsList />} />
        <Route path="/my-projects" element={<SubmitReports />} />
        <Route path="/team-formation" element={<TeamFormation />} />
      </Routes>
      </div>
    </BrowserRouter>
  )
}
