import React, { useState, useEffect } from 'react';
import "./Navbar.css"

export default function MyProjects() {
  const [projects, setProjects] = useState([]);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null); // New state to store the project to be deleted

  useEffect(() => {
    fetchProjectsFromBackend();
  }, []);

  const fetchProjectsFromBackend = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/project/getprofessorproject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: localStorage.getItem('professorName') })
      })
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = (projectName) => {
    setProjectToDelete(projectName); // Set the project to be deleted
    setShowDeleteAlert(true); // Show the delete alert
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/project/Deleteproject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: projectToDelete })
      })
      await res.json();
      fetchProjectsFromBackend();
      setShowDeleteAlert(false);
      console.log('Project Deleted');
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteAlert(false);
  };

  return (
    <div className={`${projects.length === 0 ? 'h-screen' : ''} main-content relative flex flex-col gap-2 items-center bg-white shadow-md rounded-lg p-6 w-screen `}>
      <h2 className="text-2xl font-bold mb-4">My Projects</h2>
      {projects.length === 0 ? (
        <p className='text-6xl text-slate-300 self-items-center'>No projects applied</p>
      ) : (
        projects.map((project, index) => (
          <div key={index} className="border-solid border-2 bg-white flex flex-col rounded-lg shadow-md hover:shadow-lg hover:bg-teal-50 p-4 w-full">
            <div className='flex flex-row justify-between'>
              <h3 className="text-2xl font-semibold">{project.name}</h3>
              <button
                onClick={() => handleDelete(project.name)}
                className='btn mt-2 h-6 w-16 bg-lime-950 shadow shadow-teal-200 hover:bg-black hover:shadow-md 
                hover:shadow-teal-200 text-white md:ml-8 font-semibold px-2 rounded duration-300 md:static'
              >
                Delete
              </button>
            </div>

            <div>
              {project.domains.map((domain, idx) => (
                <div key={idx} className="rounded-full bg-gray-200 px-2 py-1 text-sm inline-block mr-2 mb-2">{domain}</div>
              ))}
            </div>
            <div><p className="text-md "><strong>Team Size:</strong> {project.minteamsize} - {project.maxteamsize}</p></div>

            <div><p className="text-lg ">{project.description} Lorem ipsum dolor sit amet, consectetur adipiscing elit,
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
            ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit
            esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
            officia deserunt mollit anim id est laborum.</p></div>
          </div>
        ))
      )}
      {showDeleteAlert && (
        <div className="Delete-alert-overlay fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
          <div className="Delete-alert-box bg-white p-4 rounded-lg shadow-md">
            <p className="text-lg font-semibold mb-4">Are you sure you want to Delete the project?</p>
            <div className="flex justify-center">
              <button onClick={handleConfirmDelete} className="bg-red-500 text-white px-4 py-2 rounded mr-4">Yes</button>
              <button onClick={handleCancelDelete} className="bg-gray-400 text-gray-800 px-4 py-2 rounded">No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
