import React from 'react'
import { useState, useEffect } from 'react'
import './Navbar.css'


export default function ViewReports() {

  const api = import.meta.env.VITE_backend;

  useEffect(() => {
    fetchReportsFromBackend();
  });

  const fetchReportsFromBackend = async () => {
    try{
        const name=localStorage.getItem('professorName');
        const res = await fetch(`${api}/api/project/getreportlink`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({name:name}),
        });
        const data = await res.json();
        console.log(data);
    }catch(err){
        console.log(err);
    }
  }

  return (
    <div className='main-content'>ViewReports</div>
  )
}
