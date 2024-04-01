import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logout from './Logout';
import { navItems } from './NavItems';
import { BookOpenIcon, Bars3BottomRightIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { RiArrowDropDownLine } from "react-icons/ri";
import Dropdown from './DropDown';
import './Navbar.css'


const Navbar= () => {

      let [open, setOpen] =useState(false);
      const [dropdown, setDropdown] = useState(false);


    return (
        <div className='shadow-md w-full fixed top-0 left-0'>
           <div className='md:flex items-center justify-between bg-white h-16 md:px-10 px-7 m-0'>
            {/* logo section */}
            <div className='font-bold text-2xl cursor-pointer flex items-center gap-1'>
                <BookOpenIcon className='w-7 h-7 text-blue-600'/>
                <span>Capstone</span>
            </div>
            {/* Menu icon */}
            <div onClick={()=>setOpen(!open)} className='absolute right-8 top-6 cursor-pointer md:hidden w-7 h-7'>
                {
                    open ? <XMarkIcon/> : <Bars3BottomRightIcon />
                }
            </div>
            {/* linke items */}
            <ul className={`bg-white h-25 items-center md:h-10 md:flex md:items-center md:pb-0 pb-12 absolute md:static md:bg-white md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in ${open ? 'top-12' : 'top-[-490px]'}`}>
                {
                    navItems.map((link) => {
                      if (link.title === "Projects") {
                        return (
                          <li
                            key={link.id}
                            className={link.cName}
                            onMouseEnter={() => setDropdown(true) }
                            onMouseLeave={() => setDropdown(false)}
                            
                          >
                            
                            <span className='flex flex-row py-0 cursor-pointer text-gray-800 hover:text-blue-400 duration-500 md:ml-8 md:my-0 my-0  font-semibold'>{link.title}<RiArrowDropDownLine className='size-6 mt-0.5' /></span>
                            {dropdown && <Dropdown />}
                          </li>
                        );
                      }
                    return(<li key={link.id} className='md:ml-8 md:my-0 my-7 font-semibold'>
                        <a href={link.path} className=' h-16 text-gray-800 hover:text-blue-400 duration-500'>{link.title}</a>
                    </li>)})
                }

                <Logout/>
            </ul>
           </div>
        </div>
    );
};

export default Navbar;