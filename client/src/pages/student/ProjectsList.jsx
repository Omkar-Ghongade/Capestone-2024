import React, { useState, useEffect } from 'react';
import { FaFilter } from "react-icons/fa";
import ReactPaginate from 'react-paginate';

import "./Navbar.css"




export default function ProjectsList() {

  const [FilterbarOpen, setFilterbarOpen] = useState(true); // State to manage Filterbar visibility


  const [projectData, setProjectsData] = useState(null);
  var count=0;
  const [finalcount,setFinalCount]=useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isApply, setIsApply] = useState(false);
  const [applyReason, setApplyReason] = useState('');
  const [filters, setFilters] = useState({
    filter1: false,
    filter2: false,
    // Add more filters here
  });

  const [pageNumber, setPageNumber] = useState(0);
  const [projectsPerPage,setProjectsPerPage] = useState(6); // Number of projects to display per page

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
    setIsApply(false);
  }, []);

  useEffect(() => {
    if (projectData) {
      let count = 0;
      for (var i = 0; i < projectData.length; i++) {
        if (projectData[i].isopen) {
          count++;
        }
      }
      console.log(count);
      setFinalCount(count);
    }
  }, [projectData]);
  
  useEffect(() => {
    console.log(finalcount);
  }, [finalcount]);
  

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

    console.log(selectedProject.domains);

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

  const toggleSidebar = () => {
      setFilterbarOpen(!FilterbarOpen);
    };


    useEffect(() => {
      const handleResize = () => {
        // Check if the screen size is lg (you may need to adjust the width)
        const isLg = window.innerWidth >= 700; // Example width for lg screen
  
        // Update the state of FilterbarOpen based on screen size
        setFilterbarOpen(isLg);
      };

      // handleResize();

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);

    
      const handleFilterChange = (filterName, isChecked) => {
        setFilters(prevFilters => ({
          ...prevFilters,
          [filterName]: isChecked
        }));
      };
      const ProjectFilter = () => {
      return (
        <div className={`bg-gray-100 p-4 ${!FilterbarOpen && 'invisible'}`}>
          <h2 className="text-lg font-semibold mb-2">Filter Projects</h2>
          <div className="flex flex-col space-y-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-indigo-600"
                onChange={(e) => handleFilterChange('filter1', e.target.checked)}
                checked={filters.filter1} // Ensure checkbox state is controlled
              />
              <span className="ml-2">Filter 1</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-indigo-600"
                onChange={(e) => handleFilterChange('filter2', e.target.checked)}
                checked={filters.filter2} // Ensure checkbox state is controlled
              />
              <span className="ml-2">Filter 2</span>
            </label>
            {/* Add more filters as needed */}
          </div>
        </div>
      );
    };
    

  
  

  
  const handlePageChange = ({ selected }) => {
    setPageNumber(selected);
  };

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < 640) {
        setProjectsPerPage(6); // Small screens
      } else if (screenWidth >= 640 && screenWidth < 1024) {
        setProjectsPerPage(8); // Medium screens
      } else {
        setProjectsPerPage(16); // Large screens
      }
    };

    handleResize(); // Set initial projects per page based on current screen size
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const pagesVisited = pageNumber * projectsPerPage;

  return(
    <div>

    <button
        className="fixed main-content lg:hidden bottom-10 right-8 bg-teal-800 rounded-full drop-shadow-lg flex justify-center items-center text-white text-4xl hover:bg-teal-800 z-40"
        onClick={toggleSidebar}>
          <div className='flex w-10 h-10 justify-center items-center'>
          <FaFilter className='w-6 h-6'/>
          </div>
        </button>

      <div className="main-content flex flex-row gap-1">

        

        <div
        className={`${FilterbarOpen? 'w-1/6 px-2 ' : 'w-0 '
          } lg:w-72 -z-100 bg-teal-700 relative duration-500`}
      >
          {/* Responsive Filterbar */}
          <ProjectFilter handleFilterChange={handleFilterChange} />     

        </div>
        
        <div className="w-5/6 pr-4 ">
          {isApply ? (
            <div className='w-3/4 w-full bg-white rounded-lg shadow-md p-6 '>
              <h2 className='text-2xl font-bold mb-4'>Apply for Project</h2>
              <div className='mb-4 '>
                <p><span className='font-bold'>Name:</span> {selectedProject.name}</p>
                <p><span className='font-bold'>Description:</span> {selectedProject.description}</p>
                <p><span className='font-bold'>Skills:</span> {selectedProject.domains}</p>
              </div>
              <div className='mb-4'>
                <label htmlFor='applyReason' className='block text-sm font-bold mb-1'>Why do you want to apply?</label>
                <input type='text' id='applyReason' className='w-full border rounded px-3 py-2' value={applyReason} onChange={handleApplyReasonChange} />
              </div>
              <div className='flex flex-row '>
                <button onClick={cancelApply} className='bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700 mr-2'>Cancel</button>
                <button onClick={handleSubmit} className='bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 mr-2'>Apply</button>
                
              </div>
            </div>
          ) : (
            <div className='flex flex-col gap-2 mb-4'>
              {projectData && projectData.slice(pagesVisited, pagesVisited + projectsPerPage).map((project, index) => (
                project.isopen && 
                  <div key={index} className=' flex flex-row max-w-200px border-2 border-solid bg-white shadow-md hover:shadow-lg hover:shadow-teal-100 rounded-md overflow-hidden pb-2'>
                    <div className=' pl-2 w-5/6 my-1 '>
                    <h2 className='text-left text-xl  font-bold'>{project.name}</h2>
                    <p className='text-left text-gray-600 '>{project.professor}</p>
                    <p className='text-left text-gray-600 '>{project.domains}</p>
                    </div>
                    <div className=' w-1/6 flex justify-center items-center'>
                    <button onClick={() => applyProjectClick(project)} className='h-8 w-auto text-center bg-blue-500 text-white font-bold px-4 rounded hover:bg-blue-700'>View</button>
                    </div>
                  </div>
              ))}
            </div>
          )}
          
        </div>
      </div>
      {projectData && isApply? (
          <></>
        ):(<ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          pageCount={Math.ceil(finalcount/projectsPerPage)}
          onPageChange={handlePageChange}
          containerClassName="pagination"
          disabledClassName="pagination__link--disabled"
          activeClassName={"active"}
        />)}
      </div>
    );
}
