import React, { useEffect, useState } from "react";
import { auth, provider } from "./config";
import { signInWithPopup } from "firebase/auth";
import SHome from './student/Home';
import PHome from './professor/Home';
import AHome from './admin/Home';
import CryptoJS from 'crypto-js';
import { useAuthState } from 'react-firebase-hooks/auth';
import { onAuthStateChanged } from "firebase/auth";
import { BsInfoCircle, BsGoogle } from 'react-icons/bs';
import { FaGoogle } from 'react-icons/fa';

// Encryption/decryption key (should be kept secret and not hardcoded like this in production)
const ENCRYPTION_KEY = "c%r2n8#FqPb6@vKt5^hMw9&sGzYp3!dA";

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(null);


  const handleClick = () => {
    signInWithPopup(auth, provider)
      .then((data) => {
        console.log(data);
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

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('user signed in');
      }else
      {
        console.log('user signed out');
      }
    });
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

  function LoginBox({ children }) {
    return (
      <div className="w-100 h-80 bg-white shadow-2xl p-6 rounded-lg justify-center">
        {children}
      </div>
    );
  }
  return (
    <div className="flex flex-col">
      {role ? (
        renderHomeComponent()
      ) : (
        <div className="flex flex-col md:flex-row w-screen">
          {/* Left side with picture */}
          <div className="w-full md:w-2/3 h-1/2 md:h-screen bg-cover bg-center" style={{ backgroundImage: 'url(https://s3.ap-southeast-1.amazonaws.com/images.deccanchronicle.com/dc-Cover-6kn3u7utpcqktf72fklu6sr534-20230219004624.Medi.jpeg)' }}></div>

          {/* Right side with login box */}
          <div className="md:w-1/3 h-screen p-10 md:p-20 bg-white shadow-lg rounded-md flex flex-col justify-center">
            <div className="flex justify-center items-center">
              <LoginBox>
                <h2 className="text-3xl font-semibold mt-4 text-center josefin-sans">LOGIN</h2>
                <button className="bg-white shadow-lg hover:shadow-xl text-gray-800 font-bold py-3 px-6 rounded mb-4 flex items-center justify-center w-full md:w-[22rem]" onClick={handleClick}>
                  <FaGoogle className="inline-block mr-2" size={20} color="#494623" /> Sign in with Google
                </button>
                <div className="text-sm flex items-center text-gray-500 mb-4">
                  <BsInfoCircle className="h-4 w-4 mr-1" />
                  Students must use their University email ID
                </div>
                <div className="text-sm mb-4">
                  <button className="bg-[#494623] shadow shadow-teal-200 hover:bg-black hover:shadow-md hover:shadow-teal-200 text-white font-semibold py-3 px-6 w-full md:w-[22rem] rounded-md flex items-center justify-center" onClick={() => console.log('Faculty login clicked')}>Faculty Login</button>
                </div>
                <div className="text-sm">
                  <button className="bg-[#494623] shadow shadow-teal-200 hover:bg-black hover:shadow-md hover:shadow-teal-200 text-white font-semibold py-3 px-6 w-full md:w-[22rem] rounded-md mb-4 flex items-center justify-center" onClick={() => console.log('Admin login clicked')}>Admin Login</button>
                </div>
              </LoginBox>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}