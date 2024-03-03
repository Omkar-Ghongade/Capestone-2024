import React, { useState, useEffect } from 'react';

export default function ProjectsList() {

  const [projectData, setProjectsData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      await fetchPeojectData();
    };
    fetchData();
  }, []);

  const fetchPeojectData = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/project/getprojectdata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      // console.log(data);
      setProjectsData(data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      {projectData && projectData.map((project, index) => (
        <div key={index}>
          <p>Name: {project.name}</p>
          <button >Apply</button>
        </div>
      ))}
    </div>
  )
}
