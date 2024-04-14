import React, { useState, useEffect } from 'react';
import "./Navbar.css"
import { auth } from '../config';
import { onAuthStateChanged } from 'firebase/auth';

const ENCRYPTION_KEY = "c%r2n8#FqPb6@vKt5^hMw9&sGzYp3!dA";

export default function MainHome() {

  const [professorData, setProfessorData] = useState(null);

  useEffect(() => {
    fetchProfessorData();
  }, []);

  const fetchProfessorData = async (email) => {
    onAuthStateChanged(auth, async (user) => {
      console.log(user);
      try {
        const res = await fetch('http://localhost:3000/api/professor/displayprofessordata', {
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
    <div className='main-content'>
      {professorData && (
        <div>
        <p>Name: {professorData.name}</p>
        <p>Email: {professorData.emailid}</p>
        <p>Profile Photo: <img  src={professorData.profilephoto} alt="Professor" /></p>
        <p>ID: {professorData._id}</p>
      </div>
      )}
    </div>
  )
}