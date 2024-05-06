import React, { useState, useEffect } from 'react';
import { auth } from '../config';
import { onAuthStateChanged } from 'firebase/auth';
import Footer from './Footer';

const MainHome = () => {
  const [studentData, setStudentData] = useState(null);
  const [team, setTeam] = useState([]);
  const [project, setProject] = useState(null);
  const api = import.meta.env.VITE_backend;

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    onAuthStateChanged(auth, async (user) => {
      try {
        const res = await fetch(`${api}/api/student/getstudentdata`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ emailid: user.email, url: user.photoURL }),
        });
        const data = await res.json();
        localStorage.setItem('rollNumber', data.rollNumber);
        setStudentData(data);
        fetchStudentTeam();
      } catch (error) {
        console.log(error);
      }
    });
  };

  const fetchStudentTeam = async () => {
    try {
      const res = await fetch(`${api}/api/auth/getteam`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rollNumber: localStorage.getItem('rollNumber') }),
      });
      const data = await res.json();
      setTeam(data.teammembers);
      fetchStudentProject(data.teamcode);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchStudentProject = async (teamcode) => {
    try {
      const res = await fetch(`${api}/api/auth/getproject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamcode: teamcode }),
      });
      const data = await res.json();
      setProject(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="main-content flex justify-center items-center h-full" style={{ fontFamily: 'Helvetica, Arial, sans-serif', textAlign: 'center' }}>
      {studentData && (
        <div className="bg-[#4D4D29] rounded-lg p-6 shadow-md w-5/12 border-2 border-gray-300 text-white relative">
          <div className="rounded-full overflow-hidden mx-auto w-36 h-36 absolute top-[-50px] left-1/2 transform -translate-x-1/2">
            <img src={studentData.photo} alt="Student" className="w-full h-full object-cover" />
          </div>
          <div className="mt-4 pt-20">
            <h1 className="text-3xl font-bold">{studentData.name}</h1>
            <p className="text-gray-300">{studentData.rollNumber}</p>
            <p><b>{studentData.school}</b> </p>
            <p><b>{studentData.stream} : </b>{studentData.section}</p>
            <p className="truncate">{studentData.emailid}</p>
          </div>
          <div className="mt-6">
            <h2 className="text-xl font-semibold">Team</h2>
            {team.length === 0 ? (
              <p className="text-gray-300 pl-4">Join a team or create a team</p>
            ) : (
              <div className="text-gray-300 pl-4 justify-center">
                {team.map((member, index) => (
                  <p key={index}>{index + 1}. {member}</p>
                ))}
              </div>
            )}
          </div>
          <div className="mt-6">
            <h2 className="text-xl font-semibold">Project</h2>
            {project ? (
              <p className="text-gray-300 pl-4">Project Title: {project.projectName}</p>
            ) : (
              <p className="text-gray-300 pl-4">Project not assigned</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MainHome;
