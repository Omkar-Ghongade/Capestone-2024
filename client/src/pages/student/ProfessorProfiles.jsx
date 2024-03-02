import React, { useState, useEffect } from 'react';

export default function ProfessorProfiles() {

  const [professorData, setProfessorData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      await fetchProfessorData();
    };
    fetchData();
  }, []);

  const fetchProfessorData = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/professor/getprofessordata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      // console.log(data);
      setProfessorData(data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      {professorData && professorData.map((professor, index) => (
        <div key={index}>
          <p>Name: {professor.name}</p>
          <img src={professor.profilephoto}/>
        </div>
      ))}
    </div>
  )
}
