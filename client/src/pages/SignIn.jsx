import React from 'react'
import { useState } from 'react';
import SHome from './student/Home';
import PHome from './professor/Home';
import AHome from './admin/Home';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const userType='';
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type='email'  placeholder='E-Mail' className='border p-3 rounded-lg' id='email' onChange={handleChange} />
        <input type='password' placeholder='Password' className='border p-3 rounded-lg' id='password' onChange={handleChange} />
        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>Sign In</button>
      </form>
    </div>
  )
}
