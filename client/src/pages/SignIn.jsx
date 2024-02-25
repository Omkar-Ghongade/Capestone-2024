import React, { useEffect, useState } from "react";
import { auth, provider } from "./config";
import { signInWithPopup } from "firebase/auth";
import SHome from './student/Home';
import PHome from './professor/Home';
import AHome from './admin/Home';
import CryptoJS from 'crypto-js';

// Encryption/decryption key (should be kept secret and not hardcoded like this in production)
const ENCRYPTION_KEY = "YourEncryptionKey";

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(null);

  const handleClick = () => {
    signInWithPopup(auth, provider)
      .then((data) => {
        setEmail(data.user.email);
        setData(data.user.email);
      })
      .catch(error => {
        console.log(error.message);
      });
  };

  const encryptData = (data) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
  };

  const decryptData = (encryptedData) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  };

  const setData = async (email) => {
    try {
      const res = await fetch('http://localhost:3000/api/auth/getdata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailid: email }),
      });
      const data = await res.json();
      setRole(data.role);
      // Encrypt email and role before storing in localStorage
      localStorage.setItem('email', encryptData(email));
      localStorage.setItem('role', encryptData(data.role));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Retrieve and decrypt email and role from localStorage
    const encryptedEmail = localStorage.getItem('email');
    const encryptedRole = localStorage.getItem('role');
    if (encryptedEmail && encryptedRole) {
      setEmail(decryptData(encryptedEmail));
      setRole(decryptData(encryptedRole));
    }
  }, []);

  // Render different components based on the role
  const renderHomeComponent = () => {
    // Retrieve and decrypt email and role from localStorage
    const encryptedEmail = localStorage.getItem('email');
    const encryptedRole = localStorage.getItem('role');

    if (encryptedEmail && encryptedRole) {
      const decryptedEmail = decryptData(encryptedEmail);
      const decryptedRole = decryptData(encryptedRole);

      switch (decryptedRole) {
        case 'admin':
          return <AHome />;
        case 'student':
          return <SHome />;
        case 'professor':
          return <PHome />;
        default:
          return null; // Render nothing if role is not determined yet
      }
    } else {
      return null; // Render nothing if encrypted data is not found in localStorage
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      {role ? ( // Check if role is fetched
        renderHomeComponent()
      ) : (
        <button onClick={handleClick}>Signin With Google</button>
      )}
    </div>
  );
}
