import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js'; // Import CryptoJS library
import "./Navbar.css"
import { auth } from '../config';
import { onAuthStateChanged } from 'firebase/auth';

const ENCRYPTION_KEY = "c%r2n8#FqPb6@vKt5^hMw9&sGzYp3!dA";

export default function MainHome() {

  const [studentData, setStudentData] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const emailId = decryptEmailIdFromLocalStorage(); 
      if (emailId) {
        await fetchStudentData(emailId);
      }
    };
    fetchData();
  }, []);

  // getting team details
  useEffect(() => {

  }, []);

  // getting project details
  useEffect((() => {

  }), []);

  const decryptEmailIdFromLocalStorage = () => {
    const encryptedEmail = localStorage.getItem('email');
    if (encryptedEmail) {
      const bytes = CryptoJS.AES.decrypt(encryptedEmail, ENCRYPTION_KEY);
      let decryptedEmail = bytes.toString(CryptoJS.enc.Utf8);
      decryptedEmail = decryptedEmail.replace(/^"(.*)"$/, '$1');
      return decryptedEmail;
    }
    return null;
  }

  const fetchStudentData = async (email) => {
    // console.log(email);
    onAuthStateChanged(auth, async (user) => {
      try {
        const res = await fetch('http://localhost:3000/api/student/getstudentdata', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ emailid: email, url: user.photoURL }),
        });
        const data = await res.json();
        localStorage.setItem('rollNumber', data.rollNumber);
        setStudentData(data);
      } catch (error) {
        console.log(error);
      }
    });
  };


    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="items-center  flex justify-center">
          {studentData && (
            <div className='main-content grid grid-cols-1 sm:grid-cols-2 gap-3 justify-center'>
              <div className="flex flex-col items-center bg-white shadow-md rounded-lg p-6 w-strech">
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
              <div className="flex flex-col items-center bg-white shadow-md rounded-lg p-4 w-full max-w-md mt-4 sm:mt-0">
                <div className="mt-4">
                  <h2 className="text-3xl font-semibold mb-2">Team</h2>
                  <p className="text-gray-600 text-xl">
                    {/* {studentData.team} */} ABCD <br/>
                    EFGH <br/>
                    IJKL
                  </p>
                </div>

                <div className="mt-6">
                  <h2 className="text-3xl font-semibold mb-2">Project</h2>
                  <div>
                    <p className="text-gray-600 text-xl">
                      {/* studentData.Project */}
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
