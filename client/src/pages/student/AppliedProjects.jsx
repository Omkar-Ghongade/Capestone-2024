import React, { useState, useEffect } from 'react';
import "./Navbar.css";

export default function AppliedProjects() {
  const [appliedProjects, setAppliedProjects] = useState([]);
  const [showCancelAlert, setShowCancelAlert] = useState(false);
  const [teamcode, setTeamcode] = useState('');
  const [projectName, setProjectName] = useState('');
  const [loading, setLoading] = useState(true);
  const api = import.meta.env.VITE_backend;

  useEffect(() => {
    const fetchData = async () => {
      await fetchAppliedProjects();
    };
    fetchData();
  }, []);

  const fetchAppliedProjects = async () => {
    try {
      const studentId = localStorage.getItem('rollNumber');
      const res = await fetch(`${api}/api/project/getappliedproject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentId: studentId })
      });
      const data = await res.json();
      console.log(data);
      setAppliedProjects(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleCancel = (teamcode, projectName) => {
    setTeamcode(teamcode);
    setProjectName(projectName);
    console.log(teamcode, projectName);
    setShowCancelAlert(true);
  };

  const handleConfirmCancel = async () => {
    // Perform cancel logic here
    setShowCancelAlert(false);
    try{
      const res = await fetch(`${api}/api/project/oncancelproject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamcode: teamcode, projectName: projectName })
      });
      const data = await res.json();
      console.log(data);
      window.location.reload();
    }catch(err){
      console.log(err);
    }
  };

  const handleCancelCancel = () => {
    setTeamcode('');
    setProjectName('');
    console.log(teamcode, projectName);
    setShowCancelAlert(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <img 
          src="https://srmap.edu.in/file/2019/12/Logo-2.png" 
          alt="Loading..." 
          style={{ width: "200px", height: "auto" }} 
        />
      </div>
    );
  }

  return (
    <div className={`${appliedProjects.length === 0 ? 'h-screen' : ''}main-content relative flex flex-col gap-2 items-center bg-white shadow-md rounded-lg p-6 w-screen `}>
      <h2 className="text-2xl font-bold mb-4">Applied Projects</h2>
      {appliedProjects.length === 0 ? (
        <p className='text-6xl text-slate-300 self-items-center'>No projects applied</p>
      ) : (
        appliedProjects.map((project, index) => (
          <div key={index} className=" border-solid border-2 bg-white flex flex-col rounded-lg shadow-md hover:shadow-lg hover:bg-teal-50  p-4 w-full">
            <div className=' flex flex-row  justify-between'>
              <h3 className="text-2xl font-semibold">{project.projectName}</h3>
              <button onClick={() => handleCancel(project.teamcode, project.projectName)} className='btn mt-2 h-6 w-16 bg-lime-950 shadow shadow-teal-200 hover:bg-black hover:shadow-md 
              hover:shadow-teal-200 text-white md:ml-8 font-semibold px-2 rounded duration-300 md:static'>Cancel</button>
            </div>
            <div className=''><p className="text-lg ">{project.projectProfessor}</p></div>
            <div className=''>
              {/* Mapping through project.domains and rendering each element within a rounded box */}
              {project.projectDomain.map((domain, idx) => (
                <div key={idx} className="rounded-full bg-gray-200 px-2 py-1 text-sm inline-block mr-2 mb-2">{domain}</div>
              ))}
            </div>
            <div className=''><p className="text-md ">Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
             ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit 
             esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
            officia deserunt mollit anim id est laborum.</p></div>
          </div>
        ))
      )}
      {showCancelAlert && (
        <div className="cancel-alert-overlay fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
          <div className="cancel-alert-box bg-white p-4 rounded-lg shadow-md">
            <p className="text-lg font-semibold mb-4">Are you sure you want to cancel?</p>
            <div className="flex justify-center">
              <button onClick={handleConfirmCancel} className="bg-red-500 text-white px-4 py-2 rounded mr-4">Yes</button>
              <button onClick={handleCancelCancel} className="bg-gray-400 text-gray-800 px-4 py-2 rounded">No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
