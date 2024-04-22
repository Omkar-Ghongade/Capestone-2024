import React, { useState, useEffect } from 'react';
import { FaFilter } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import "./Navbar.css";

export default function ViewReports() {
  const [reports, setReports] = useState([]);
  const [uniqueTitles, setUniqueTitles] = useState([]);
  const [viewReport, setViewReport] = useState(null);
  const [selectedReports, setselectedReports] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [isView, setIsView] = useState(false);
  const api = import.meta.env.VITE_backend;



  useEffect(() => {
    fetchReportsFromBackend();
  }, []);

  const fetchReportsFromBackend = async () => {
    try{
        const name=localStorage.getItem('professorName');
        const res = await fetch(`${api}/api/project/getreportlink`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({name:name}),
        });
        const data = await res.json();
        console.log(data);
        setReports(data);
      const titles = data.map(application => application.projectName);
      setUniqueTitles([...new Set(titles)]);
    }catch(err){
        console.log(err);
    }
  }


  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      setSidebarOpen(screenWidth >= 768);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleProjectClick = (title) => {
    const filteredReports = reports.filter(app => app.projectName === title);
    setselectedReports(filteredReports);
  };

  const handleViewClick = async (report) => {
    setIsView(true);
    setViewReport(report);
    console.log(viewReport);
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
          className={`${sidebarOpen && !isView ? 'w-2/6 max-sm:w-3/6 px-2 ' : 'w-0'
            } bg-gray-100 top-0 right-0 relative duration-500`}
        >
          <div className={`bg-gray-100 p-4 ${(!sidebarOpen || isView) && 'invisible'}`}>
            <h2 className="text-xl font-semibold mb-2">Projects</h2>
            <div className="flex flex-col space-y-2">
              {uniqueTitles.map((title, index) => (
                <button
                  key={index}
                  className={`text-left py-2 px-4 w-full rounded ${selectedReports.length>0 && selectedReports[0].projectName === title ? 'bg-gray-400' : ''}`}
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
          {selectedReports.length > 0 ? (
            <div>
              {isView ? (
                <div>
                <div className="border border-gray-200 rounded-lg shadow-md p-4">
                  <div className='flex flex-row justify-between'>
                    <h2 className="text-xl font-semibold mb-4">{viewReport.projectName}</h2>
                    <button onClick={handleViewCancel} className='top-2 right-2 text-gray-600 hover:text-gray-800'>
                      <IoIosClose size={32} />
                    </button>
                  </div>
                
                  <h3 className="text-lg font-semibold mb-2">{viewReport.teamcode}</h3>
                  <p className="mb-2">{viewReport.applyReason}</p>
                
                  <div>
              <h2 className="text-2xl font-bold mt-4">Reports</h2>
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6  gap-2 ">
                {selectedReports[0].reports.map((report, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md mb-2 border-solid border-2 ">
                    
                    <a href={report} target="_blank" rel="noreferrer">
                      <img src="https://logodownload.org/wp-content/uploads/2021/05/adobe-acrobat-reader-logo-0-1536x1536.png" alt="Report Placeholder" className=" h-48 rounded-t-lg w-full object-cover mb-1" />
                      <p className='text-center'>Report {index + 1}</p>
                    </a>
                  </div>
                ))}
              </div>
            </div>
                </div>
              </div>
              ) : (
                  <div>
                   <h1 className='text-xl font-semibold mb-4'>{selectedReports[0].projectName}</h1>
                  {selectedReports.map(report => report.isaccepted && (

                  <div key={report.id} className=' flex flex-row max-w-200px border-2 border-solid bg-white shadow-md hover:shadow-lg hover:shadow-teal-100 rounded-md overflow-hidden pb-2'>
                    <div className=' pl-2 w-5/6 my-1 '>
                      <h2 className='text-left text-xl mb-1  font-bold'>{report.teamcode}</h2>
                      <p className='text-left mb-2 text-gray-600 '>{report.applyReason}</p>
                    </div>
                    <div className=' w-1/6 flex justify-center items-center'>
                    <button onClick={() => handleViewClick(report)} className='h-8 w-auto text-center bg-blue-500 text-white font-bold px-4 rounded hover:bg-blue-700'>View</button>
                    </div>
                  </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-lg font-semibold">Select a project from the sidebar to view the reports.</div>
          )}
        </div>
      </div>
    </div>
  );
}
