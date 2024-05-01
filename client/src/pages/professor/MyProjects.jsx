import React, { useState, useEffect } from 'react';
import "./Navbar.css"

export default function MyProjects() {
  const [projects, setProjects] = useState([]);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null); // New state to store the project to be deleted
  const [edit, setEdit] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [domains, setDomains] = useState({
    AIML: false,
    DataScience: false,
    CyberSecurity: false,
    VLSI: false,
    DeepLearning: false
  });
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [minteamsize, setMinTeamSize] = useState('');
  const [maxteamsize, setMaxTeamSize] = useState('');
  const api = import.meta.env.VITE_backend;

  useEffect(() => {
    fetchProjectsFromBackend();
  }, []);

  const fetchProjectsFromBackend = async () => {
    try {
      const res = await fetch(`${api}/api/project/getprofessorproject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: localStorage.getItem('professorName') })
      })
      const data = await res.json();
      setProjects(data);
      console.log(projects);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = (projectName) => {
    setProjectToDelete(projectName); // Set the project to be deleted
    setShowDeleteAlert(true); // Show the delete alert
  };

  const handleEdit = (project) => {
    setProjectName(project.name);
    setProjectDescription(project.description);
    setMinTeamSize(project.minteamsize);
    setMaxTeamSize(project.maxteamsize);
    Object.keys(domains).forEach((domain) => {
      domains[domain] = false;
    });
    setEdit(true);
    setEditProject(project);
    for (let domain of project.domains) {
      domains[domain] = true;
    }
    console.log(project);
  }

  const handleSave = async (e) => { 
    try{
      const selectedDomains = Object.keys(domains).filter(domain => domains[domain]);
      if (selectedDomains.length === 0) {
        setErrorMessage('Please select at least one domain.');
        return;
      }
      if (minteamsize > maxteamsize) {
        setErrorMessage('Minimum team size is greater than Maximum team size');
        return;
      }

      console.log(projectName, projectDescription, selectedDomains, minteamsize, maxteamsize);
      console.log(editProject);  
      const res = await fetch(`${api}/api/project/saveEditProject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          editProject: editProject,
          name: projectName,
          description: projectDescription,
          domains: selectedDomains,
          minteamsize: minteamsize,
          maxteamsize: maxteamsize
        })
      })
      fetchProjectsFromBackend();
      setEdit(false);
    }catch(err){
      console.error(err);
    }
    setErrorMessage('');
    console.log('Save');
  }

  const handleCheckboxChange = (domain) => {
    setDomains(prevDomains => ({
      ...prevDomains,
      [domain]: !prevDomains[domain]
    }));
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await fetch(`${api}/api/project/Deleteproject`, {
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
            {edit && project.name === editProject.name ? (
              <div>
                <div className="main-content w-full mx-auto p-6 bg-white rounded-lg shadow-xl">
                  <h2 className="text-2xl font-bold mb-4">Post a Project</h2>
                  <form onSubmit={handleSave}>
                    <div className="mb-4">
                      <label className="block mb-1">Name of Project:</label>
                      <input
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        className="border rounded-md border-gray-300 px-2 py-1 w-full"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block mb-1">Description of Project:</label>
                      <textarea
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        className="border rounded-md border-gray-300 px-2 py-1 w-full"
                        required
                      />
                    </div>
                    <div className="flex flex-row max-md:flex-col gap-4 mb-4">
                      <label className="block mb-1">Domains:</label>
                      {Object.keys(domains).map((domain) => (
                        <label key={domain} className="block mb-2">
                          <input
                            type="checkbox"
                            checked={domains[domain]}
                            onChange={() => handleCheckboxChange(domain)}
                            className="mr-2"
                          />
                          {domain}
                        </label>
                      ))}
                    </div>
                    <div className='flex flex-row'>
                      <div className="mb-4 mr-4">
                        <label className="block mb-1">Minimum Team Size:</label>
                        <input
                          type="number"
                          value={minteamsize}
                          onChange={(e) => setMinTeamSize(e.target.value)}
                          className="border rounded-md border-gray-300 px-2 py-1 w-full"
                          required
                          min="1" max="4"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block mb-1">Maximum Team Size:</label>
                        <input
                          type="number"
                          value={maxteamsize}
                          onChange={(e) => setMaxTeamSize(e.target.value)}
                          className="border rounded-md border-gray-300 px-2 py-1 w-full"
                          required
                          min="1" max="4"
                        />
                      </div>
                    </div>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                      Save
                    </button>
                    {errorMessage && <div className="text-red-500  my-4">{errorMessage}</div>}
                  </form>
                </div>
              </div>
            ) : (
              <div>
                <div className='flex flex-row justify-between'>
                  <h3 className="text-2xl font-semibold">{project.name}</h3>
                  {!project.isopen ? (<p className="text-green-500">Accepted</p>) : (
                    <div>
                      <button
                        onClick={() => handleEdit(project)}
                        className='btn mt-2 h-6 w-16 bg-blue-500 hover:bg-blue-700 text-white md:ml-8 font-semibold px-2 rounded duration-300 md:static'
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(project.name)}
                        className='btn mt-2 h-6 w-16 bg-red-500 hover:bg-red-700 text-white md:ml-8 font-semibold px-2 rounded duration-300 md:static'
                      >
                        Delete
                      </button>
                    </div>
                  )}
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
            )}
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
