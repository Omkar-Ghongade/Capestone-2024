import React, { useState, useEffect } from 'react';
import "./Navbar.css"
import { auth } from '../config';
import { onAuthStateChanged } from 'firebase/auth';

const ENCRYPTION_KEY = "c%r2n8#FqPb6@vKt5^hMw9&sGzYp3!dA";

export default function MainHome() {

  const [professorData, setProfessorData] = useState(null);
  const api = import.meta.env.VITE_backend;

  useEffect(() => {
    fetchProfessorData();
  }, []);

  const fetchProfessorData = async (email) => {
    onAuthStateChanged(auth, async (user) => {
      console.log(user);
      try {
        const res = await fetch(`${api}/api/professor/displayprofessordata`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ emailid: user.email}),
        });
        const data = await res.json();
        console.log(data);
        localStorage.setItem('professorName', data.name);
        setProfessorData(data);
      } catch (error) {
        console.log(error);
      }
    });
  }

  return (
    <div className=''>
      <div><img className="w-full h-screen" src="https://student.srmap.edu.in/srmapstudentcorner/resources/images/Ariel-View-1.jpg" alt="mountain" /></div>
    <div className="absolute max-sm:mt-16 top-0 left-0 w-full h-full flex justify-center items-center " style={{ fontFamily: 'Helvetica, Arial, sans-serif', textAlign: 'center' }}>
      {professorData && (
        <div className=" rounded-lg p-6 bg-[#4D4D29] bg-opacity-95 shadow-md w-5/12 relative">
          <div className="rounded-full overflow-hidden mx-auto w-32 md:w-40 h-32 md:h-40 absolute top-[-64px] md:top-[-80px] left-1/2 transform -translate-x-1/2">
            <img src={professorData.profilephoto} alt="Professor" className="w-full h-full object-cover" />
          </div>
          <div className="pt-20 text-white">
            <h1 className="text-3xl py-2 font-bold">{professorData.name}</h1>
            <p className="text-xl py-2 ">{professorData.designation}</p>
            <p className="truncate ">{professorData.emailid}</p>
            
          </div>
        </div>
      )}
    </div>
    </div>
  )
}

