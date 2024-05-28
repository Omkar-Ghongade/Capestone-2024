import React, { useState, useEffect } from 'react';
import { FaFilter } from "react-icons/fa";
import "./Navbar.css";

export default function ViewReports() {
  const [reports, setReports] = useState([]);
  const [uniqueTitles, setUniqueTitles] = useState([]);
  const [clickedButtonindex, setClickedButtonindex] = useState(null);
  const [viewReport, setViewReport] = useState(null);
  const [selectedReports, setselectedReports] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [isView, setIsView] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ field1: '', field2: '', field3: '' });
  const api = import.meta.env.VITE_backend;

  useEffect(() => {
    fetchReportsFromBackend();
  }, []);

  useEffect(() => {
    fetchProjecttitles();
  }, []);

  useEffect(() => {
    console.log(reports);
    const titles = uniqueTitles.map(application => application.projectName);
    handleProjectClick(titles[0], 0);
  }, [reports]);

  const fetchReportsFromBackend = async () => {
    try {
      const name = localStorage.getItem('professorName');
      const res = await fetch(`${api}/api/project/getreportlink`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name }),
      });
      const data = await res.json();
      console.log(data);
      setReports(data);
    } catch (err) {
      console.log(err);
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

  const handleProjectClick = (title, index) => {
    console.log(title);
    console.log(index);
    const filteredReports = reports.filter(app => app.projectName === title);
    console.log(reports)
    console.log(filteredReports);
    setselectedReports(filteredReports);
    setViewReport(filteredReports[0]);
    setClickedButtonindex(index);
  };

  const handleViewClick = async (report) => {
    console.log(report);
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

  const handleMarksClick = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setFormData({ field1: '', field2: '', field3: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
    handleModalClose();
  };

  return (
    <div className='main-content mb-4' style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
      <button
        className="fixed md:hidden bottom-10 right-8 bg-gray-700 rounded-full drop-shadow-lg flex justify-center items-center text-white text-4xl hover:bg-teal-800 z-50"
        onClick={toggleSidebar}>
        <div className='flex w-10 h-10 justify-center items-center'>
          <FaFilter className='w-6 h-6' />
        </div>
      </button>

      <div className="flex flex-row gap-1">
        <div
          className={`${sidebarOpen ? 'w-2/6 max-sm:w-full  max-sm:flex max-sm:justify-center max-sm:items-center max-sm:bg-opacity-80 max-md:z-40' : 'w-0'
            } bg-[#4b4b29] h-screen text-white top-0 right-0 max-sm:left-0 relative max-sm:fixed duration-500`}
        >
          <div className={` p-4 ${(!sidebarOpen) && 'invisible'}`}>
            <h2 className="text-3xl text-center font-semibold mb-2">Projects</h2>
            <div className="flex flex-col max-sm:border-2 max-sm:border-solid max-sm:bg-[#272715] max-sm:rounded-md">
              {uniqueTitles.map((title, index) => (
                <button
                  key={index}
                  className={`text-left text-lg max-sm:border-y max-sm:border-solid max-sm:border-white hover:bg-[#272715] hover:border-2 py-2 px-2 w-full duration-300 ${clickedButtonindex === index ? 'bg-[#272715] border-2 font-semibold' : ''}`}
                  onClick={() => { handleProjectClick(title, index); if (window.innerWidth < 640) { toggleSidebar(); } }}
                >
                  {title}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={`${sidebarOpen ? 'px-2 z-40 ' : ''
          } pr-4 z-30 w-full `}>
          <h2 className="text-xl text-center font-semibold mt-4 mb-4">{uniqueTitles[clickedButtonindex]}</h2>

          {
            selectedReports.length > 0 ? (
              <div>
                <div>
                  <div className="border border-gray-200 rounded-lg shadow-md p-4">
                    <div className='flex flex-row justify-between'>
                      <h2 className="text-xl font-semibold mb-4">{viewReport.projectName}</h2>
                    </div>

                    <h3 className="text-lg-2"><b>Team Code : </b>{viewReport.teamcode}</h3>
                    <br></br>
                    <p className="mb-2">{viewReport.applyReason}</p>

                    <div>
                      <h2 className="text-2xl font-bold mt-4">Reports</h2>
                      <div className="flex flex-col pt-3">
                        {selectedReports[0].reports.map((report, index) => (
                          <div key={index} className="w-full px-2 mb-4 flex">
                            <div className="bg-[#4D4D29] text-white rounded-lg shadow-md mb-2 border-solid border-2 p-2 flex justify-between items-center">
                              <a href={report} target="_blank" rel="noreferrer">
                                <p className='text-center'>Report {index + 1}</p>
                              </a>
                            </div>
                            <button className="ml-4 bg-blue-500 text-white px-2 py-1 rounded" onClick={handleMarksClick}>Marks</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full text-6xl text-slate-300 text-center">No application is accepted for this project</div>
            )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4">Enter Marks</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="field1">Field 1</label>
                <input
                  type="text"
                  name="field1"
                  value={formData.field1}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="field2">Field 2</label>
                <input
                  type="text"
                  name="field2"
                  value={formData.field2}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="field3">Field 3</label>
                <input
                  type="text"
                  name="field3"
                  value={formData.field3}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={handleModalClose}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
