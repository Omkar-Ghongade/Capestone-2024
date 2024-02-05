import React, { useEffect, useState } from "react";
import {auth,provider} from "../firebase/config";
import {signInWithPopup} from "firebase/auth";
import Home from "./Home";

export default function SingIn() {
    const [value,setValue] = useState('')
    const handleClick =()=>{
        signInWithPopup(auth,provider).then((data)=>{
            if(data.user.email.endsWith('@srmap.edu.in')){
                localStorage.setItem('email',data.user.email)
                setValue(data.user.email)
            }
        })
    }

    useEffect(()=>{
        setValue(localStorage.getItem('email'))
    })

    return (
        <div>
            {value?<Home/>:
            <button onClick={handleClick} className="bg-blue-600">Signin With Google</button>
            }
        </div>
    );
}
