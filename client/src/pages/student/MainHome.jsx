import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js'; // Import CryptoJS library
import "./Navbar.css"

const ENCRYPTION_KEY = "c%r2n8#FqPb6@vKt5^hMw9&sGzYp3!dA";

export default function MainHome() {

  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const emailId = decryptEmailIdFromLocalStorage(); 
      if (emailId) {
        await fetchStudentData(emailId);
      }
    };
    fetchData();
  }, []);

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
    try {
      const res = await fetch('http://localhost:3000/api/student/getstudentdata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailid: email }),
      });
      const data = await res.json();
      // console.log(data.rollNumber);
      localStorage.setItem('rollNumber', data.rollNumber);
      setStudentData(data);
    } catch (error) {
      console.log(error);
    }
  };

  // return (
  //   <div className='main-content'>
  //     {studentData && (
  //       <div>
  //         <p>Name: {studentData.name}</p>
  //       </div>
  //     )}
  //   </div>
  // )
    return (
      <div className=" main-content flex justify-center h-full items-center bg-gray-100">
        <div className="bg-white shadow-md rounded-lg p-4 w-full ">
          {studentData && (<div>
          <div className="flex items-center">
            <img
              src="https://via.placeholder.com/150"
              alt="profile"
              className="h-24 w-24 rounded-full mr-4"
            />
            <div>
              <h1 className="text-2xl font-bold">{studentData.name}</h1>
              <p className="text-gray-500">{studentData.rollNumber}</p>
            </div>
          </div>
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
            <div>
              <p className="text-gray-600">
                Email: {studentData.emailid}
              </p>
              <p className="text-gray-600">
                Phone: {studentData.contactNumber}
              </p>
            </div>
          </div>
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Team</h2>
            <p className="text-gray-600">
              {/* {studentData.team} */} ABCD <br/>
              EFGH <br/>
              IJKL
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Project</h2>
            <div>
              <p className="text-gray-600">
                {/* studentData.Project */}
                ABCDEFGHIJKL
              </p>
            </div>
          </div>
          
          </div>)}
        </div>
      </div>
    );
}
