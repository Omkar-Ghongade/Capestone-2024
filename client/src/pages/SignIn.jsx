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
      <div className="flex flex-col w-100 h-100 bg-white shadow-2xl p-6 rounded-lg justify-center item-center">
        <div className="flex flex-col w-parent justify-center ml-28 mr-28">
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
        <div className="flex flex-col md:flex-row w-screen">
          <div className="w-full md:w-2/3 h-1/2 md:h-screen bg-cover bg-center" style={{ backgroundImage: 'url(https://srmap.edu.in/wp-content/uploads/2020/11/infra12.png)' }}></div>
          <div className="md:w-1/3 h-screen p-10 md:p-20 bg-white shadow-lg rounded-md flex flex-col justify-center">
            <div className="flex justify-center items-center">
              <LoginBox>
                <h2 className="text-3xl mt-4 text-center josefin-sans">LOGIN</h2>
                <button className="bg-white shadow-lg hover:shadow-xl hover:bg-zinc-50 text-gray-800 font-bold py-3 px-6 rounded mb-4 flex items-center justify-center w-full md:w-[22rem]" onClick={studenthandleClick}>
                  <FaGoogle className="w-4 h-4 inline-block mr-2" /> Sign in with Google
                </button>
                <div className="text-sm flex items-center text-gray-500 mb-4">
                  <BsInfoCircle className="h-4 w-4 mr-1" />
                  Students must use their University email ID
                </div>
                <div className="text-sm mb-4">
                  <button className="bg-lime-950 shadow shadow-teal-200 hover:bg-black hover:shadow-md hover:shadow-teal-200 text-white font-semibold py-3 px-6 w-full md:w-[22rem] rounded-md flex items-center justify-center" onClick={profhandleClick}>Faculty Login</button>
                </div>
                <div className="text-sm">
                  <button className="bg-lime-950 shadow shadow-teal-200 hover:bg-black hover:shadow-md hover:shadow-teal-200 text-white font-semibold py-3 px-6 w-full md:w-[22rem] rounded-md mb-4 flex items-center justify-center" onClick={adminhandleClick}>Admin Login</button>
                </div>
              </LoginBox>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
