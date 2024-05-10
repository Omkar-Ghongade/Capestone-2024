// import React from 'react';
// import { Link } from 'react-router-dom';

// export default function Navbar() {
//   return (
//     <nav>
//       <ul>
//         <li><Link to="/">Home</Link></li>
//         <li><Link to="/overview">Overview</Link></li>
//         <li><Link to="/logout">Logout</Link></li>
//       </ul>
//     </nav>
//   );
// }


import React, { useState } from 'react';
import Logout from './Logout.jsx';
import { navItems} from './NavItems.jsx';
import { BookOpenIcon, Bars3BottomRightIcon, XMarkIcon } from '@heroicons/react/24/solid'



const Navbar= () => {

      let [open, setOpen] =useState(false);


    return (
        <div className='shadow-md w-full bg-[#272715] fixed top-0 left-0 z-50' style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
           <div className='md:flex items-center justify-between bg-[#272715] h-16 md:px-10 px-7 m-0'>
            {/* logo section */}
            <a href="/">
            <div className='font-bold text-2xl cursor-pointer flex items-center gap-1'>
              
                <BookOpenIcon className='text-white w-7 h-7 text-lime-950'/>
                <span className='text-white'>Capstone</span>
                
            </div>
            </a>
           
            <div onClick={()=>setOpen(!open)} className='absolute right-8 top-6 cursor-pointer md:hidden w-7 h-7'>
                {
                    open ? <XMarkIcon/> : <Bars3BottomRightIcon />
                }
            </div>
            {/* linke items */}
            <ul className={`bg-[#272715] h-25 items-center md:h-10 md:flex md:items-center md:pb-0 pb-12 absolute md:static md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in ${open ? 'top-12' : 'top-[-490px]'}`}>
                {
                    navItems.map((link) => {

                    return(<li key={link.id} className='text-md mt-5 md:ml-8 md:my-0 my-7 font-semibold'>
                        <a onClick={()=>setOpen(false)} href={link.path} className=' h-16 text-white hover:text-teal-700 duration-500'>{link.title}</a>
                        
                    </li>)})
                }

                <Logout/>
            </ul>
           </div>
        </div>
    );
};

export default Navbar;