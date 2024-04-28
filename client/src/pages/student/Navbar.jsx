import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logout from './Logout';
import { navItems, ProjectDropdown } from './NavItems';
import { BookOpenIcon, Bars3BottomRightIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { RiArrowDropDownLine } from "react-icons/ri";
import Dropdown from './DropDown';



const Navbar= () => {

      let [open, setOpen] =useState(false);
      const [dropdown, setDropdown] = useState(false);
      const api = import.meta.env.VITE_backend;


    return (
        <div className='shadow-md w-full fixed top-0 left-0 z-50'>
           <div className='md:flex items-center justify-between bg-white py-3 h-16 md:px-10 px-7'>
            {/* logo section */}
            <div className='flex flex-row justify-between pt-1 relative'>
            <a href="/" className='block p-2 rounded-full shadow-sm hover:shadow-md hover:shadow-teal-100 transform hover:-translate-y-1 transition duration-200 ease-in-out'>
            <div className='font-bold text-2xl cursor-pointer flex items-center gap-1'>
              
                <BookOpenIcon className='w-7 h-7 text-lime-950'/>
                <span>Capstone</span>
                
            </div>
            </a>
            {/* Menu icon */}
            <div onClick={()=>setOpen(!open)} className=' right-8 top-6 cursor-pointer md:hidden w-7 h-7'>
                {
                    open ? <XMarkIcon/> : <Bars3BottomRightIcon />
                }
            </div>
            </div>
            {/* linke items */}
            <ul className={`bg-white h-25 items-center md:h-10 md:flex md:items-center md:pb-0 pb-12 absolute md:static md:bg-white md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in ${open ? 'top-12' : 'top-[-490px]'}`}>
                {
                    navItems.map((link) => {
                      if(link.title === "Projects" && open ){
                        return (
                          <React.Fragment key={link.id}>
                            {ProjectDropdown.map((item) => (
                              <li onClick={()=>setOpen(!open)} key={item.id} className='md:ml-8 md:my-0 my-7 font-semibold'>
                                <Link to={item.path} className='h-16 text-gray-800 hover:text-teal-700 duration-500'>{item.title}</Link>
                              </li>
                            ))}
                          </React.Fragment>);

                      }

                      else if (link.title === "Projects") {
                        return (
                          <li 
                            key={link.id}
                            className=""
                            onMouseEnter={() => setDropdown(true) }
                            onMouseLeave={() => setDropdown(false)}
                            
                          >
                            
                            <span className='flex flex-row py-7 text-md cursor-pointer text-gray-800 hover:text-teal-700 duration-500 md:ml-8 md:my-0 my-0  font-semibold'>{link.title}<RiArrowDropDownLine className='size-6 mt-0' /></span>
                            {dropdown && <Dropdown className=""/>}
                          </li>
                        );
                      }
                      
                    return(<li key={link.id} className=' text-md mt-5 md:ml-8 md:my-0 my-3 font-semibold'>
                        <a onClick={()=>setOpen(false)} href={link.path} className=' h-16 text-gray-800 hover:text-teal-700 duration-500'>{link.title}</a>
                        
                    </li>)})
                }

                <Logout/>
            </ul>
           </div>
        </div>
    );
};

export default Navbar;