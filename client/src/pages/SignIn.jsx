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
      <div className="flex flex-col w-100 h-100 bg-white shadow-2xl p-6 rounded-lg justify-center item-center">
        <div className="flex flex-col w-parent justify-center ml-28 mr-28">
        <img className="w-32" src="https://srmap.edu.in/file/2019/12/Logo-2.png" alt="SRM Logo" />
      </div>
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
          <div className="w-full md:w-2/3 h-1/2 md:h-screen bg-cover bg-center" style={{ backgroundImage: 'url(https://srmap.edu.in/wp-content/uploads/2020/11/infra12.png)' }}></div>

          {/* Right side with login box */}
          <div className="md:w-1/3 h-screen p-10 md:p-20 bg-white shadow-lg rounded-md flex flex-col justify-center">
            <div className="flex justify-center items-center">
              <LoginBox>
                <h2 className="text-3xl mt-4 text-center josefin-sans">LOGIN</h2>
                <button className="bg-white shadow-lg hover:shadow-xl hover:bg-zinc-50 text-gray-800 font-bold py-3 px-6 rounded mb-4 flex items-center justify-center w-full md:w-[22rem]" onClick={handleClick}>
                  <svg className="w-4 h-4 inline-block mr-2"  xmlns="http://www.w3.org/2000/svg"preserveAspectRatio="xMidYMid" viewBox="0 0 256 262" id="google"><path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path><path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path><path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"></path><path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path></svg> Sign in with Google
                </button>
                <div className="text-sm flex items-center text-gray-500 mb-4">
                  <BsInfoCircle className="h-4 w-4 mr-1" />
                  Students must use their University email ID
                </div>
                <div className="text-sm mb-4">
                  <button className="bg-lime-950 shadow shadow-teal-200 hover:bg-black hover:shadow-md hover:shadow-teal-200 text-white font-semibold py-3 px-6 w-full md:w-[22rem] rounded-md flex items-center justify-center" onClick={() => console.log('Faculty login clicked')}>Faculty Login</button>
                </div>
                <div className="text-sm">
                  <button className="bg-lime-950 shadow shadow-teal-200 hover:bg-black hover:shadow-md hover:shadow-teal-200 text-white font-semibold py-3 px-6 w-full md:w-[22rem] rounded-md mb-4 flex items-center justify-center" onClick={() => console.log('Admin login clicked')}>Admin Login</button>
                </div>
              </LoginBox>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}