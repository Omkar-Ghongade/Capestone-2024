import React, { useState, useEffect } from 'react';
import "./Navbar.css"


const ProjectFilter = ({ handleFilterChange }) => {
  return (
    <div className="bg-gray-100 p-4">
      <h2 className="text-lg font-semibold mb-2">Filter Projects</h2>
      <div className="flex flex-col space-y-2">
        <label className="inline-flex items-center">
          <input type="checkbox" className="form-checkbox h-4 w-4 text-indigo-600" onChange={(e) => handleFilterChange('filter1', e.target.checked)} />
          <span className="ml-2">Filter 1</span>
        </label>
        <label className="inline-flex items-center">
          <input type="checkbox" className="form-checkbox h-4 w-4 text-indigo-600" onChange={(e) => handleFilterChange('filter2', e.target.checked)} />
          <span className="ml-2">Filter 2</span>
        </label>
        {/* Add more filters as needed */}
      </div>
    </div>
  );
};

export default function ProjectsList() {
  const [projectData, setProjectsData] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isApply, setIsApply] = useState(false);
  const [applyReason, setApplyReason] = useState('');
  const [filters, setFilters] = useState({
    filter1: false,
    filter2: false,
    // Add more filters here
  });

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

    const handleFilterChange = (filterName, isChecked) => {
      setFilters({ ...filters, [filterName]: isChecked });
      // You can add filtering logic here based on the selected filters
    };

    const data = {
      projectId: selectedProject._id,
      projectName: selectedProject.name,
      projectDomain: selectedProject.domains,
      projectProfessor: selectedProject.professor,
      applyReason: applyReason,
      studentId: localStorage.getItem('rollNumber'),
    }
    console.log(data);
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
      cancelApply
    }
  }

  return(
      <div className="main-content flex">
        <div className="w-1/4">
          {/* <ProjectFilter handleFilterChange={handleFilterChange} /> */}
        </div>
        <div className="w-3/4">
          {isApply ? (
            <div className='bg-white rounded-lg shadow-md p-6'>
              <h2 className='text-2xl font-bold mb-4'>Apply for Project</h2>
              <div className='mb-4'>
                <p><span className='font-bold'>Name:</span> {selectedProject.name}</p>
                <p><span className='font-bold'>Description:</span> {selectedProject.description}</p>
                <p><span className='font-bold'>Skills:</span> {selectedProject.domains}</p>
              </div>
              <div className='mb-4'>
                <label htmlFor='applyReason' className='block text-sm font-bold mb-1'>Why do you want to apply?</label>
                <input type='text' id='applyReason' className='w-full border rounded px-3 py-2' value={applyReason} onChange={handleApplyReasonChange} />
              </div>
              <div className='flex flex-col md:flex-row md:justify-between'>
                <button onClick={handleSubmit} className='bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 mb-2 md:mb-0 md:mr-2'>Submit</button>
                <button onClick={cancelApply} className='bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700'>Cancel</button>
              </div>
            </div>
          ) : (
            <div>
              {projectData && projectData.map((project, index) => (
                <div key={index} className='flex flex-row justify-between bg-white rounded-lg shadow-md p-6 mb-4'>
                  <div>
                  <h2 className='text-xl font-bold mb-2'>{project.name}</h2>
                  <p className='text-gray-600 mb-2'>{project.professor}</p>
                  <p className='text-gray-600 mb-2'>{project.domains}</p>
                  </div>
                  <div className='py-6'>
                  <button onClick={() => applyProjectClick(project)} className='h-10 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700'>Apply</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
}
