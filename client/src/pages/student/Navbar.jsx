import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logout from './Logout';
import { navItems, ProjectDropdown } from './NavItems';
import { BookOpenIcon, Bars3BottomRightIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { RiArrowDropDownLine } from "react-icons/ri";
import Dropdown from './DropDown';

const Navbar = () => {
    let [open, setOpen] = useState(false);
    const [dropdown, setDropdown] = useState(false);

    return (
        <div className='shadow-md w-full fixed top-0 left-0 z-50 bg-[#4D4D29]' style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
            <div className='md:flex items-center justify-between bg-[#4D4D29] py-3 h-16 md:px-10 px-7'>

                <div className='flex flex-row justify-between pt-1 relative'>
                    <a href="/" className='block p-2 transform transition duration-200 ease-in-out'>
                        <div className='font-bold text-2xl cursor-pointer flex items-center gap-1 text-white'>
                            <BookOpenIcon className='w-7 h-7 text-white'/>
                            <span>Capstone</span>
                        </div>
                    </a>
                    {/* Menu icon */}
                    <div onClick={() => setOpen(!open)} className=' right-8 top-6 cursor-pointer md:hidden w-7 h-7'>
                        {open ? <XMarkIcon className="text-white" /> : <Bars3BottomRightIcon className="text-white" />}
                    </div>
                </div>

                <ul className={`bg-[#4D4D29] h-25 items-center md:h-10 md:flex md:items-center md:pb-0 pb-12 absolute md:static md:bg-[#4D4D29] md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in ${open ? 'top-12' : 'top-[-490px]'}`}>
                    {
                        navItems.map((link) => {
                            if (link.title === "Projects" && open) {
                                return (
                                    <React.Fragment key={link.id}>
                                        {ProjectDropdown.map((item) => (
                                            <li onClick={() => setOpen(!open)} key={item.id} className='bg-[#4D4D29] pt-1 md:ml-8 md:my-0 my-7 font-semibold'>
                                                <Link to={item.path} className='h-16 text-white '>{item.title}</Link>
                                            </li>
                                        ))}
                                    </React.Fragment>);
                            } else if (link.title === "Projects") {
                                return (
                                    <li 
                                        key={link.id}
                                        className="pt-1"
                                        onMouseEnter={() => setDropdown(true)}
                                        onMouseLeave={() => setDropdown(false)}
                                    >
                                        <span className='flex flex-row py-7 text-md cursor-pointer text-white duration-500 md:ml-8 md:my-0 my-0 font-semibold'>{link.title}<RiArrowDropDownLine className='size-6 mt-0' /></span>
                                        {dropdown && <Dropdown className="" />}
                                    </li>
                                );
                            }
                            return (
                                <li key={link.id} className=' text-md mt-5 md:ml-8 md:my-0 my-3 font-semibold pt-1'>
                                    <a onClick={() => setOpen(false)} href={link.path} className=' h-16 text-white duration-500'>{link.title}</a>
                                </li>
                            );
                        })
                    }
                    <Logout className='pt-2'/>
                </ul>
            </div>
        </div>
    );
};

export default Navbar;
