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
      <div className="items-center bg-gray-100">
          {studentData && (<div className='  main-content grid grid-cols-2 max-md:grid-cols-1 gap-3 '>
          <div className="flex flex-col items-center bg-white shadow-md rounded-lg p-10 h-screen w-full max-md:h-full ">
            <div className='w-full flex justify-center items-center'>
            <img
              src="https://via.placeholder.com/150"
              alt="profile"
              className="h-52 w-52 rounded-full m-0"
            />
            </div>
            <div className='w-full flex flex-col justify-center items-center mt-4'>
              <h1 className="text-5xl font-bold">{studentData.name}</h1>
              <p className="text-gray-500 text-4xl mt-4">{studentData.rollNumber}</p>
            </div>
          
            <div className="mt-8 flex flex-col justify-center items-center">
              <h2 className="text-4xl font-semibold mb-4">Contact Information</h2>
              <div>
                <p className="text-gray-600">
                  <b>Email:</b> {studentData.emailid}
                </p>
                <p className="text-gray-600">
                  <b>Phone:</b> {studentData.contactNumber}
                </p>
              </div>
            </div>
          </div>
            <div className="flex flex-col items-center bg-white shadow-md rounded-lg p-4 h-screen w-full max-md:h-full max-md:mt-2">
              <div className="mt-8">
                <h2 className="text-4xl font-semibold mb-4">Team</h2>
                <p className="text-gray-600 text-2xl">
                  {/* {studentData.team} */} ABCD <br/>
                  EFGH <br/>
                  IJKL
                </p>
              </div>

              <div className="mt-8">
                <h2 className="text-4xl font-semibold mb-4">Project</h2>
                <div>
                  <p className="text-gray-600 text-2xl">
                    {/* studentData.Project */}
                    ABCDEFGHIJKL
                  </p>
                </div>
              </div>
              
            </div>
          </div>)}
        
      </div>
    );
}
