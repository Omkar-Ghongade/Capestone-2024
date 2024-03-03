import React, { useState, useEffect } from 'react';

export default function ProjectsList() {
  const [projectData, setProjectsData] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isApply, setIsApply] = useState(false);
  const [applyReason, setApplyReason] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      await fetchProjectData();
    };
    fetchData();
  }, []);

  useEffect(() => {
    const isApplyStored = localStorage.getItem('isApply');
    const selectedProjectStored = localStorage.getItem('selectedProject');
    if (isApplyStored) {
      setIsApply(JSON.parse(isApplyStored));
    }
    if (selectedProjectStored) {
      setSelectedProject(JSON.parse(selectedProjectStored));
    }
  }, []);

  const fetchProjectData = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/project/getprojectdata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      setProjectsData(data);
    } catch (error) {
      console.log(error);
    }
  }

  const applyProjectClick = async (project) => {
    setSelectedProject(project);
    setIsApply(true);
    localStorage.setItem('isApply', JSON.stringify(true));
    localStorage.setItem('selectedProject', JSON.stringify(project));
  }

  const cancelApply = () => {
    setSelectedProject(null);
    setIsApply(false);
    localStorage.removeItem('isApply');
    localStorage.removeItem('selectedProject');
  }

  const handleApplyReasonChange = (event) => {
    setApplyReason(event.target.value);
  }

  const handleSubmit = async () => {

    const minWords = 2;
    const words = applyReason.trim().split(/\s+/);
    if (words.length < minWords) {
      alert(`Minimum ${minWords} words are required for the apply reason.`);
      return;
    }

    const data = {
      projectId: selectedProject._id,
      projectName: selectedProject.name,
      projectDomain: selectedProject.domains,
      projectProfessor: selectedProject.professor,
      applyReason: applyReason,
      studentId: localStorage.getItem('rollNumber'),
    }
    // console.log(data);
    try {
      const res = await fetch('http://localhost:3000/api/project/applyproject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      // console.log(result);
      cancelApply();
    } catch (error) {
      // console.log(error);
      alert('Error in applying project. Please try again.');
    }
  }

  return (
    <div>
      {isApply ?
        (
          <div>
            <div>
              <p>Name: {selectedProject.name}</p>
              <p>Description: {selectedProject.description}</p>
              <p>Skills: {selectedProject.domains}</p>
            </div>
            <div>
                <label htmlFor="applyReason">Why do you want to apply?</label>
                <input type="text" id="applyReason" value={applyReason} onChange={handleApplyReasonChange} />
            </div>
            <button onClick={handleSubmit}>Submit</button>
            <button onClick={cancelApply}>Cancel</button>
          </div>
        )
        :
        (
          <div>
            {projectData && projectData.map((project, index) => (
              <div key={index}>
                <p>Name: {project.name}</p>
                <button onClick={() => applyProjectClick(project)}>Apply</button>
              </div>
            ))}
          </div>
        )
      }
    </div>
  )
}
