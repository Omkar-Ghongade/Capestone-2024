import React, { useState, useEffect } from 'react';
import { FaFilter } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import "./Navbar.css";

export default function ManageApplications() {
  const [applications, setApplications] = useState([]);
  const [uniqueTitles, setUniqueTitles] = useState([]);
  const [viewApplication, setViewApplication] = useState(null);
  const [selectedApplications, setselectedApplications] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [isView, setIsView] = useState(false);
  const api = import.meta.env.VITE_backend;

  useEffect(() => {
    fetchApplications();
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
      // console.log(data);
      setApplications(data);
      const titles = data.map(application => application.projectName);
      setUniqueTitles([...new Set(titles)]);
    } catch (err) {
      console.error(err);
    }
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleProjectClick = (title) => {
    const filteredApplications = applications.filter(app => app.projectName === title);
    setselectedApplications(filteredApplications);
  };

  const handleViewClick = async (application) => {
    setIsView(true);
    setViewApplication(application);
    console.log(viewApplication);
  };

  const handleViewCancel = () => {
    setIsView(false);
  };

  const acceptApplication = async (projectName, teamcode) => {
    console.log(projectName, teamcode);
    try {
      const res = await fetch(`${api}/api/project/acceptproject`, {
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

  const rejectApplication = async (projectName, teamcode) => {
    console.log(projectName, teamcode);
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
          className={`${sidebarOpen && !isView ? 'w-2/6 max-sm:w-3/6 px-2 ' : 'w-0 hidden '
            } bg-gray-100 top-0 right-0 relative duration-500`}
        >
          <div className={`bg-gray-100 p-4 ${(!sidebarOpen) && 'invisible'}`}>
            <h2 className="text-xl font-semibold mb-2">Projects</h2>
            <div className="flex flex-col space-y-2">
              {uniqueTitles.map((title, index) => (
                <button
                  key={index}
                  className={`text-left py-2 px-4 w-full rounded ${selectedApplications.length>0 && selectedApplications[0].projectName === title ? 'bg-gray-400' : ''}`}
                  onClick={() => handleProjectClick(title)}
                >
                  {title}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={`${sidebarOpen ? 'w-5/6 px-2 z-40 ' : 'w-full'
          } pr-4 z-30 `}>
          {selectedApplications.length > 0 ? (
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
                  <p className="mb-2">{viewApplication.applyReason}</p>
                  {(viewApplication.isaccpeted === viewApplication.isrejected) ? (<div className="flex">
                    <button onClick={()=>rejectApplication(viewApplication.projectName, viewApplication.teamcode)} className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700">Reject</button>
                    <button onClick={()=>acceptApplication(viewApplication.projectName, viewApplication.teamcode)} className="bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-red-700 ml-4">Accept</button>
                  </div>):(<h1>Already Accepted</h1>)}
                </div>
              </div>
              ) : (
                  <div>
                   <h1 className='text-xl font-semibold mb-4'>{selectedApplications[0].projectName}</h1>
                  {selectedApplications.map(application => !application.isrejected && (

                  <div key={application.id} className=' flex flex-row max-w-200px border-2 border-solid bg-white shadow-md hover:shadow-lg hover:shadow-teal-100 rounded-md overflow-hidden pb-2'>
                    <div className=' pl-2 w-5/6 my-1 '>
                      <h2 className='text-left text-xl mb-1  font-bold'>{application.teamcode}</h2>
                      <p className='text-left mb-2 text-gray-600 '>{application.applyReason}</p>
                    </div>
                    <div className=' w-1/6 flex justify-center items-center'>
                    <button onClick={() => handleViewClick(application)} className='h-8 w-auto text-center bg-blue-500 text-white font-bold px-4 rounded hover:bg-blue-700'>View</button>
                    </div>
                  </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-lg font-semibold">Select a project from the sidebar to view applications.</div>
          )}
        </div>
      </div>
    </div>
  );
}
