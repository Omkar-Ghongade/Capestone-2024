import React, { useState, useEffect } from 'react';
import { FaFilter } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import "./Navbar.css";

export default function ManageApplications() {
  const [applications, setApplications] = useState([]);
  const [uniqueTitles, setUniqueTitles] = useState([]);
  const [viewApplication, setViewApplication] = useState(null);
  const [clickedButtonindex, setClickedButtonindex] = useState(null);
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [isView, setIsView] = useState(false);
  const [filterCGPA, setFilterCGPA] = useState(null); // State to store the filter value
  const api = import.meta.env.VITE_backend;

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    fetchProjecttitles();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      setSidebarOpen(screenWidth >= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch(`${api}/api/project/getmyapplications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: localStorage.getItem('professorName') })
      });
      const data = await res.json();
      setApplications(data);
      const titles = data.map(application => application.projectName);
      setUniqueTitles([...new Set(titles)]);
    } catch (err) {
      console.error(err);
    }
  }

  const fetchProjecttitles = async () => {
    try {
      const res = await fetch(`${api}/api/project/getprofessorproject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: localStorage.getItem('professorName') })
      });
      const titdata = await res.json();
      const titles = titdata.map(project => project.name);
      setUniqueTitles([...new Set(titles)]);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleProjectClick = (title, index) => {
    const filteredApplications = applications.filter(app => app.projectName === title);
    setSelectedApplications(filteredApplications);
    setClickedButtonindex(index);
  };

  const handleViewClick = async (application) => {
    setIsView(true);
    setViewApplication(application);
  };

  const handleViewCancel = () => {
    setIsView(false);
  };

  const sendEmails = async (projectName, teamcode) => {
    try {
      const res = await fetch(`${api}/api/project/sendemail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ projectName: projectName, teamcode: teamcode })
      });
    } catch (err) {
      console.error(err);
    }
  }

  const acceptApplication = async (projectName, teamcode) => {
    try {
      const res = await fetch(`${api}/api/project/acceptproject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ projectName: projectName, teamcode: teamcode })
      });
      sendEmails(projectName, teamcode);
      fetchApplications();
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  }

  const rejectApplication = async (projectName, teamcode) => {
    try {
      const res = await fetch(`${api}/api/project/rejectproject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ projectName: projectName, teamcode: teamcode })
      });
      fetchApplications();
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  }

  // Function to handle filtering based on CGPA
  const handleFilterChange = (event) => {
    const value = event.target.value;
    setFilterCGPA(value);
  };

  // Function to check if all CGPA's are above a certain mark
  const areAllCGPAsAboveMark = (application) => {
    if (!filterCGPA) return true; // If no filter applied, return true
    return application.cgpa.every(cgpa => cgpa >= filterCGPA);
  };

  return (
    <div className='main-content mb-4'>
      <button
        className="fixed md:hidden bottom-10 right-8 bg-gray-700 rounded-full drop-shadow-lg flex justify-center items-center text-white text-4xl hover:bg-teal-800 z-50"
        onClick={toggleSidebar}>
        <div className='flex w-10 h-10 justify-center items-center'>
          <FaFilter className='w-6 h-6 ' />
        </div>
      </button>

      <div className=" flex flex-row gap-1">

        <div
          className={`${sidebarOpen && !isView && applications.length > 0 ? 'w-2/6 max-sm:w-3/6 px-2 ' : 'w-0'
            } bg-gray-100 top-0 right-0 relative duration-500`}
        >
          <div className={`bg-gray-100 p-4 ${(!sidebarOpen || isView || applications.length === 0) && 'invisible'}`}>
            <h2 className="text-xl font-semibold mb-2">Projects</h2>
            <div className="flex flex-col space-y-2">
              {uniqueTitles.map((title, index) => (
                <button
                  key={index}
                  className={`text-left py-2 px-4 w-full rounded bg-gray-200 ${clickedButtonindex === index ? 'bg-gray-400' : ''}`}
                  onClick={() => handleProjectClick(title, index)}
                >
                  {title}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={`${sidebarOpen ? ' px-2 z-40 ' : ''
          } pr-4 z-30 w-full `}>

          {selectedApplications.length === 0 ? (
            <h2 className='w-full text-6xl text-slate-300 text-center'>No Applications made</h2>
          ) : (selectedApplications.length > 0 ? (
            <div>
              {isView ? (
                <div>
                  <div className="border border-gray-200 rounded-lg shadow-md p-4">
                    <div className='flex flex-row justify-between'>
                      <h2 className="text-xl font-semibold mb-4">{viewApplication.projectName}</h2>
                      <button onClick={handleViewCancel} className='top-2 right-2 text-gray-600 hover:text-gray-800'>
                        <IoIosClose size={32} />
                      </button>
                    </div>

                    <h3 className="text-lg font-semibold mb-2">{viewApplication.teamcode}</h3>
                    <div className='grid grid-cols-2' style={{ maxWidth: '300px' }}>
                      <h2 className='text-xl font-bold'>CGPA</h2>
                      <h2 className='text-xl font-bold'>Spec.</h2>
                      {viewApplication.cgpa.map((cgpa, index) => (
                        <React.Fragment key={cgpa}>
                          <h2 className='text-xl'>{cgpa}</h2>
                          <h2 className='text-xl'>{viewApplication.specialization[index]}</h2>
                        </React.Fragment>
                      ))}
                    </div>
                    <p className="my-3 text-xl"><b>Reason:</b> {viewApplication.applyReason}</p>
                    {(viewApplication.isaccepted === viewApplication.isrejected) ? (
                      <div className="flex">
                        <button onClick={() => rejectApplication(viewApplication.projectName, viewApplication.teamcode)} className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700">Reject</button>
                        <button onClick={() => acceptApplication(viewApplication.projectName, viewApplication.teamcode)} className="bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-red-700 ml-4">Accept</button>
                      </div>
                    ) : (<h1>Already Accepted</h1>)}
                  </div>
                </div>
              ) : (
                <div>

                  <div className={`flex justify-between mb-4 ${sidebarOpen && window.innerWidth < 768  ? 'flex-col gap-3 mb-4':''} `}>
                  <h1 className='text-xl font-semibold '>{selectedApplications[0].projectName}</h1>
                    {/* Dropdown filter */}
                      <select
                        className="p-2 border-2 border-gray-300 rounded shadow-md"
                        value={filterCGPA}
                        onChange={handleFilterChange}
                      >
                        <option value="">Select CGPA Filter</option>
                        <option value="9">Above 9</option>
                        <option value="8">Above 8</option>
                        <option value="7">Above 7</option>
                        <option value="6">Above 6</option>
                        {/* Add more options as needed */}
                      </select>
                  </div>
                  {selectedApplications.map(application => !application.isrejected && areAllCGPAsAboveMark(application) && (
                    <div key={application.id} className=' flex flex-row justify-between max-w-200px border-2 border-solid bg-white shadow-md hover:shadow-lg hover:shadow-teal-100 rounded-md overflow-hidden pb-2 pl-4'>
                      <div className='flex-col items-center pl-2 w-4/6 md:w-5/6 my-1'>  
                        <div className='mr-2 font-bold'>Team Code : {application.teamcode} </div>
                        <div className='grid grid-cols-2' style={{ maxWidth: '300px' }}>
                          <h2 className='text-xl font-bold'>CGPA</h2>
                          <h2 className='text-xl font-bold'>Spec.</h2>
                          {application.cgpa.map((cgpa, index) => (
                            <React.Fragment key={cgpa}>
                              <h2 className='text-xl'>{cgpa}</h2>
                              <h2 className='text-xl'>{application.specialization[index]}</h2>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                      <div className=' w-2/6 md:w-1/6 flex items-center max-sm:pr-32'>
                        <button onClick={() => handleViewClick(application)} className='h-8 w-auto text-center bg-blue-500 text-white font-bold px-4 rounded hover:bg-blue-700'>View</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-lg font-semibold">Select a project from the sidebar to view applications.</div>
          ))}
        </div>
      </div>

      
    </div>
  );
}
