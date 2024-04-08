import React from 'react'
import { useState, useEffect } from 'react'



export default function ManageApplications() {

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjectsFromBackend();
  },[]);

  const fetchProjectsFromBackend = async () => {
    try{
      const res=await fetch('http://localhost:3000/api/project/getmyapplications',{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({name:localStorage.getItem('professorName')})
      })
      const data=await res.json();
      console.log(data);
      setProjects(data);
    }catch(err){
        res.status(404).json({message:err.message});
    }
  }

  const acceptProject = async (projectName, teamcode) => {
    try{
      const res=await fetch('http://localhost:3000/api/project/acceptproject',{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({projectName:projectName,teamcode:teamcode})
      })
      fetchProjectsFromBackend();
    }catch(err){
      console.log(err);
    }
  }


  return (
    <div>
      <h2>Manage Applications</h2>
      <ul>
        {projects.map((project,index) => ( project.isopen &&
          <><li key={index}>
            <h3>{project.projectName}</h3>
          </li><button onClick={() => acceptProject(project.projectName, project.teamcode)}>Accept</button></>
        ))}
      </ul>
    </div>
  )
}
