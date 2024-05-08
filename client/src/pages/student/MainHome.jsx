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
    <div className=''>
      <div className='max-sm:hidden'><img className="w-full h-screen " src="https://student.srmap.edu.in/srmapstudentcorner/resources/images/Ariel-View-1.jpg" alt="mountain" /></div>
    <div className="absolute mt-3 top-0 max-sm:top-4 left-0 w-full h-full flex justify-center items-center " style={{ fontFamily: 'Helvetica, Arial, sans-serif', textAlign: 'center' }}>
      {studentData && (
        <div className=" rounded-lg p-6 bg-[#4D4D29] bg-opacity-95 shadow-md lg:w-7/12 md:w-3/4 w-11/12 relative">
          <div className="rounded-full overflow-hidden mx-auto w-32 md:w-40 h-32 md:h-40 absolute top-[-64px] md:top-[-80px] left-1/2 transform -translate-x-1/2">
            <img src={studentData.photo} alt="Student" className="w-full h-full object-cover" />
          </div>
          <div className="pt-20 text-white">
            <h1 className="text-3xl py-2 font-bold">{studentData.name}</h1>
            <p className="text-xl py-2 ">{studentData.rollNumber}</p>
            <p className="truncate ">{studentData.emailid}</p>
            <p className=''>{studentData.school} </p>
            <p className='font-medium'>{studentData.stream} : {studentData.section}</p>
            <p className=''>Spec: {studentData.specialization}</p>
            
          </div>
          <div className='flex flex-row max-sm:flex-col'> 
          <div className="mt-6 w-1/2 max-sm:w-full">
            <h2 className="text-xl font-semibold text-white">Team</h2>
            {team.length === 0 ? (
              <p className="text-white">Join a team or create a team</p>
            ) : (
              <div className=" mt-3 justify-center text-white">
                {team.map((member, index) => (
                  <p key={index}>{index + 1}. {member}</p>
                ))}
              </div>
            )}
          </div>
          <div className="mt-6 w-1/2 max-sm:w-full">
          <h2 className="text-xl text-white "><b>Project Title</b></h2>
            {project ? (
              
              <h2 className='text-lg text-white'>{project.projectName}</h2>
            ) : (
              <p className="text-white">Project not assigned</p>
            )}
          </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default MainHome;
