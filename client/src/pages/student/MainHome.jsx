import React, { useState, useEffect } from 'react';
// import CryptoJS from 'crypto-js'; // Import CryptoJS library
import "./Navbar.css"
import { auth } from '../config';
import { onAuthStateChanged } from 'firebase/auth';

const ENCRYPTION_KEY = "c%r2n8#FqPb6@vKt5^hMw9&sGzYp3!dA";

export default function MainHome() {

  const [studentData, setStudentData] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);
  const [team, setTeam] = useState([]);
  const [teamcode, setTeamcode] = useState('');

  useEffect(() => {
    fetchStudentData()
  }, []);

  useEffect(() => {
    fetchStudentTeam()
  }, []);

  const fetchStudentData = async () => {
    onAuthStateChanged(auth, async (user) => {
      // console.log(user);
      try {
        const res = await fetch('http://localhost:3000/api/student/getstudentdata', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ emailid: user.email, url: user.photoURL }),
        });
        const data = await res.json();
        // console.log(data.rollNumber);
        localStorage.setItem('rollNumber', data.rollNumber);
        setStudentData(data);
      } catch (error) {
        console.log(error);
      }
    });
  };

  const fetchStudentTeam = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/auth/getteam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rollNumber: localStorage.getItem('rollNumber') }),
      });
      const data = await res.json();
      setTeam(data.teammembers);
      setTeamcode(data.teamcode);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="items-center  flex justify-center">
        {studentData && (
          <div className='main-content grid grid-cols-1 sm:grid-cols-2 gap-3 justify-center'>
            <div className="flex flex-col items-center bg-white shadow-md rounded-lg p-6 w-full max-w-md">
              <div className='w-full flex justify-center items-center'>
                <img
                  src={studentData.photo ? studentData.photo : "https://via.placeholder.com/150"}
                  alt="profile"
                  className="h-40 w-40 rounded-full m-0"
                />
              </div>
              <div className='w-full flex flex-col justify-center items-center mt-4'>
                <h1 className="text-4xl font-bold">{studentData.name}</h1>
                <p className="text-gray-500 text-2xl mt-2">{studentData.rollNumber}</p>
              </div>

              <div className="mt-6 flex flex-col justify-center items-center">
                <h2 className="text-3xl font-semibold mb-2">Contact Information</h2>
                <div className="text-gray-600">
                  <p>
                    <b>Email:</b> {studentData.emailid}
                  </p>
                  <p>
                    <b>Phone:</b> {studentData.contactNumber}
                  </p>
                  <p>
                    <b>Gender:</b> {studentData.gender}
                  </p>
                  <p>
                    <b>School:</b> {studentData.school}
                  </p>
                  <p>
                    <b>Branch:</b> {studentData.stream}
                  </p>
                  <p>
                    <b>Semester:</b> {studentData.semester}
                  </p>
                  <p>
                    <b>Section:</b> {studentData.section}
                  </p>
                </div>
              </div>
            </div>
            <div class="flex flex-col items-center justify-center bg-white shadow-md rounded-lg p-4 w-full max-w-md mt-4 sm:mt-0 h-full">
            <div class="text-center flex-1 flex flex-col justify-center">
              <h2 class="text-3xl font-semibold mb-2">Team</h2>
              {team.length === 0 ? (
                <div>
                  <p class="text-gray-600 text-xl">Join a team or create a team</p>
                </div>
              ) : (
                <p class="text-gray-600 text-xl">
                  {team.map((member, index) => (
                    <p key={index}>{member}</p>
                  ))}
                </p>
              )}
            </div>

              <div class="text-center flex-1 flex flex-col justify-center mt-6">
                <h2 class="text-3xl font-semibold mb-2">Project</h2>
                <div>
                  <p class="text-gray-600 text-xl">
                    ABCDEFGHIJKL
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
