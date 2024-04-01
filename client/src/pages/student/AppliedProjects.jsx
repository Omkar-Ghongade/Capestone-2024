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
      // console.log(data);
      setAppliedProjects(data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='main-content'>
      <h2>Applied Projects</h2>
      {appliedProjects.map((project, index) => (
        <div key={index}>
          <h3>{project.projectName}</h3>
        </div>
      ))}
    </div>
  )
}
