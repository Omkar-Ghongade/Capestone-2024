import React, { useState, useEffect } from 'react';
import "./Navbar.css";

export default function ManageApplications() {

  const [projects, setProjects] = useState([]);
  const api = import.meta.env.VITE_backend;

  useEffect(() => {
    fetchProjectsFromBackend();
  }, []);

  const fetchProjectsFromBackend = async () => {
    setProjects([]);
    try {
      const res = await fetch(`${api}/api/project/getmyapplications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: localStorage.getItem('professorName') })
      });
      const data = await res.json();
      console.log(data); // Printing the projects data
      setProjects(data);
      console.log(projects);
    } catch (err) {
      console.error(err);
    }
  }

  const acceptProject = async (projectName, teamcode) => {
    try {
      const res = await fetch(`${api}/api/project/acceptproject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ projectName: projectName, teamcode: teamcode })
      });
      fetchProjectsFromBackend();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className='main-content'>
      <h2>Manage Applications</h2>
      <ul>
        {projects.map((project, index) => (!project.isaccepted && !project.isrejected) && (
          <React.Fragment key={index}>
            <li>
              <h3>{project.projectName}</h3>
            </li>
            <button onClick={() => acceptProject(project.projectName, project.teamcode)}>Accept</button>
          </React.Fragment>
        ))}
      </ul>
    </div>
  )
}
