import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js'; 

const ENCRYPTION_KEY = "c%r2n8#FqPb6@vKt5^hMw9&sGzYp3!dA";

export default function MainHome() {

  const [professorData, setProfessorData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const emailId = decryptEmailIdFromLocalStorage(); 
      if (emailId) {
        await fetchProfessorData(emailId);
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

  const fetchProfessorData = async (email) => {
    try {
      const res = await fetch('http://localhost:3000/api/professor/displayprofessordata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailid: email }),
      });
      const data = await res.json();
      // console.log(data);
      localStorage.setItem('professorName', data.name);
      setProfessorData(data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
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