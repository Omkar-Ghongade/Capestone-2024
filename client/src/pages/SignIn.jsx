import React, { useEffect, useState } from "react";
import {auth,provider} from "./config";
import {signInWithPopup} from "firebase/auth";
import SHome from './student/Home';
import PHome from './professor/Home';
import AHome from './admin/Home';

export default function SignIn() {
  const [value,setValue] = useState('')
    const handleClick =()=>{
        signInWithPopup(auth,provider).then((data)=>{
            setValue(data.user.email)
            if(data.user.email.endsWith('@srmap.edu.in')){
              localStorage.setItem("email",data.user.email)
            }
        })
    }

    useEffect(()=>{
        setValue(localStorage.getItem('email'))
    })

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <button onClick={handleClick}>Signin With Google</button>
    </div>
  )
}
