import React from 'react'
import { signOut } from "firebase/auth";
import {auth} from '../config';


function Logout() {
    const handleLogout = () => {
        signOut(auth)
          .then(() => {
            localStorage.clear();
            window.location.href = '/';
          })
          .catch(error => {
            console.log(error.message);
          });
      }

  return (
    <div>
      <button className='btn bg-[#4D4D29] text-white md:ml-8 font-semibold px-3 py-1 rounded duration-500 md:static' onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Logout;