import React, { useState, useEffect } from 'react';
import "./Navbar.css"

export default function AppliedProjects() {
  const [appliedProjects, setAppliedProjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchAppliedProjects();
    };
    fetchData();
  }, []);

  const fetchAppliedProjects = async () => {
    try {
      const studentId = localStorage.getItem('rollNumber');
      const res = await fetch('http://localhost:3000/api/project/getappliedproject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentId: studentId })
      });
      const data = await res.json();
      console.log(data);
      setAppliedProjects(data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="main-content flex flex-col gap-2 items-center bg-white shadow-md rounded-lg p-6 w-full">
      <h2 className="text-2xl font-bold mb-4">Applied Projects</h2>
      {appliedProjects.map((project, index) => (
        <div key={index} className=" border-solid border-2 bg-white flex flex-col rounded-lg shadow-md p-4 w-full">
          <div className='h-1/6'><h3 className="text-2xl font-semibold">{project.projectName}</h3></div>
          <div className='h-1/6'><p className="text-lg ">{project.projectProfessor}</p></div>
          <div className='h-1/6'>
          {/* Mapping through project.domains and rendering each element within a rounded box */}
          {project.projectDomain.map((domain, idx) => (
            <div key={idx} className="rounded-full bg-gray-200 px-2 py-1 text-sm inline-block mr-2 mb-2">{domain}</div>
          ))}
        </div>
          <div className='h-3/6'><p className="text-md ">Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
           ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit 
           esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
          officia deserunt mollit anim id est laborum.</p></div>
        
        </div>
      ))}
    </div>
  );
}
