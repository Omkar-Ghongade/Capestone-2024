import React from 'react'
import { signOut } from "firebase/auth";
import {auth} from '../config';


function Logout() {
    const handleLogout = () => {
        signOut(auth)
          .then(() => {
            localStorage.removeItem('email');
            localStorage.removeItem('role');
            window.location.href = '/';
          })
          .catch(error => {
            console.log(error.message);
          });
      }

  return (
    <div>
      <button className='btn bg-lime-950 shadow shadow-teal-200 hover:bg-black hover:shadow-md hover:shadow-teal-200 text-white md:ml-8 font-semibold px-3 py-1 rounded duration-500 md:static' onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Logout;