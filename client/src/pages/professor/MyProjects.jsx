import React, { useState, useEffect } from 'react';

export default function MyProjects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjectsFromBackend();
  }, []);

  const fetchProjectsFromBackend = async () => {

    try{
      const res=await fetch('http://localhost:3000/api/project/getprofessorproject',{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({name:localStorage.getItem('professorName')})
      })
      const data=await res.json();
      // console.log(data);
      setProjects(data);
    }catch(err){
        res.status(404).json({message:err.message});
    }

  };

  const deleteProject = async (projectName) => {
    try{
      const res=await fetch('http://localhost:3000/api/project/deleteproject',{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({name:projectName})
      })
      const data=await res.json();
      // console.log(data);
      fetchProjectsFromBackend();
    }catch(err){
        res.status(404).json({message:err.message});
    }
  };

  return (
    <div>
      <h2>My Projects</h2>
      <ul>
        {projects.map(project => (
          <li key={project.id}>
            <div>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <p><strong>Domains:</strong> {project.domains.join(', ')}</p>
              <p><strong>Team Size:</strong> {project.minteamsize} - {project.maxteamsize}</p>
            </div>
            {project.isopen && <button onClick={() => deleteProject(project.name)}>Delete</button>}
          </li>
        ))}
      </ul>
    </div>
  );
}
