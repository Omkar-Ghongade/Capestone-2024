import React from 'react'
import { useState, useEffect } from 'react'

export default function ViewReports() {

  useEffect(() => {
    fetchReportsFromBackend();
  });

  const fetchReportsFromBackend = async () => {
    try{
        const name=localStorage.getItem('professorName');
        const res = await fetch('http://localhost:3000/api/project/getreportlink', {
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
    <div>ViewReports</div>
  )
}
