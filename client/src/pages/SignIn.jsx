import React, { useEffect, useState } from "react";
import { auth, provider } from "./config";
import { signInWithPopup } from "firebase/auth";
import SHome from './student/Home';
import PHome from './professor/Home';
import AHome from './admin/Home';
import { useAuthState } from 'react-firebase-hooks/auth';
import { onAuthStateChanged } from "firebase/auth";
import { useSignOut } from 'react-firebase-hooks/auth';
import { BsInfoCircle, BsGoogle } from 'react-icons/bs';
import { FaGoogle } from 'react-icons/fa';


export default function SignIn() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true); // Add loading state
  const api = import.meta.env.VITE_backend;

  useEffect(() => { 
    validateData();
  },[]);


  const studenthandleClick = () => {
    signInWithPopup(auth, provider)
      .then((data) => {
        setEmail(data.user.email);
        localStorage.setItem('jwt',import.meta.env.VITE_student);
        validateData();
      })
      .catch(error => {
        console.log(error);
      });
  };

  const profhandleClick = () => {
    signInWithPopup(auth, provider)
      .then((data) => {
        setEmail(data.user.email);
        localStorage.setItem('jwt',import.meta.env.VITE_professor);
        validateData();
      })
      .catch(error => {
        console.log(error.message);
      });
  };

  const adminhandleClick = () => {
    signInWithPopup(auth, provider)
      .then((data) => {
        setEmail(data.user.email);
        localStorage.setItem('jwt',import.meta.env.VITE_admin);
        validateData();
      })
      .catch(error => {
        console.log(error.message);
      });
  };

  const validateData = async (data) => {
    onAuthStateChanged(auth, async (user) => {
      try{   
        const res=await fetch(`${api}/api/auth/getdata`,{
          method:'POST',
          headers:{
            'Content-Type':'application/json'
          },
          body:JSON.stringify({emailid:user.email})
        })
        const data=await res.json();
        const jwt=localStorage.getItem('jwt');
        var base64Url = jwt.split('.')[1];
        var decodedValue = JSON.parse(window.atob(base64Url));
        if(decodedValue.role===data.role){
          setEmail(user.email);
          setRole(data.role);
          setLoading(false); // Set loading to false once authentication is done
        }else
        localStorage.clear();
      }catch(e){
        console.log(e);
        setLoading(false);
      }
    })
    // localStorage.removeItem('jwt');
  }


  const renderHomeComponent = () => {
    if (email && role) {
      switch (role) {
        case 'admin':
          return <AHome />;
        case 'student':
          return <SHome />;
        case 'professor':
          return <PHome />;
        default:
          return null;
      }
    } else {
      return null;
    }
  };

  function LoginBox({ children }) {
    return (
      <div className="flex flex-col bg-white shadow-2xl p-6 rounded-lg justify-content-center align-items-center">
        <div className="flex flex-col w-parent justify-content-center ml-28 mr-28 ">
          <img className="w-32" src="https://srmap.edu.in/file/2019/12/Logo-2.png" alt="SRM Logo" />
        </div>
        {children}
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <img 
          src="https://srmap.edu.in/file/2019/12/Logo-2.png" 
          alt="Loading..." 
          style={{ width: "200px", height: "auto" }} 
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {role ? (
        renderHomeComponent()
      ) : (
        <div className="flex flex-col md:flex-row w-screen bg-[url(https://i.imgur.com/nue2ocY.jpeg)] bg-cover">
          <div className="w-full md:w-2/3 h-1/2 md:h-screen bg-cover bg-center" style={{ backgroundImage: 'url(https://i.imgur.com/poiHMF2.jpeg)'}}></div>
          <div className="md:w-1/3 md:p-20 md:shadow-lg md:bg-gray-100 bg-cover bg-center h-screen p-10 rounded-md flex justify-center items-center"> {/* Added justify-center and items-center */}
            <div className=" flex justify-center items-center flex-col "> {/* Centered and middle-aligned content */}
              <LoginBox>
                <h2 className="text-3xl mt-4 text-center josefin-sans">LOGIN</h2>
                <button className="bg-white shadow-lg hover:shadow-xl hover:bg-zinc-50 text-gray-800 font-bold py-3 px-6 rounded mb-4 w-full md:w-[22rem]" onClick={studenthandleClick}>
                  <svg className="w-4 h-4 inline-block mr-2" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 256 262" id="google"><path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path><path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path><path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"></path><path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path></svg> Sign in with Google
                </button>
                <div className="text-sm flex items-center text-gray-500 mb-4 ml-1">
                  <BsInfoCircle className="h-4 w-4 mr-1" />
                  Students must use their University email ID
                </div>
                <div className="text-sm mb-4">
                  <button className="bg-[#4D4D29] shadow shadow-teal-200 hover:bg-black hover:shadow-md hover:shadow-teal-200 text-white font-semibold py-3 px-6 w-full md:w-[22rem] rounded-md flex items-center justify-center" onClick={profhandleClick}>Faculty Login</button>
                </div>
                <div className="text-sm">
                  <button className="bg-[#4D4D29] shadow shadow-teal-200 hover:bg-black hover:shadow-md hover:shadow-teal-200 text-white font-semibold py-3 px-6 w-full md:w-[22rem] rounded-md mb-4 flex items-center justify-center" onClick={adminhandleClick}>Admin Login</button>
                </div>
              </LoginBox>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}