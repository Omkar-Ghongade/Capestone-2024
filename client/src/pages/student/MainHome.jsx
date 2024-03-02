import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js'; // Import CryptoJS library

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
      // console.log(data);
      setStudentData(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {studentData && (
        <div>
          <p>Name: {studentData.name}</p>
        </div>
      )}
    </div>
  )
}
