import React, { useEffect, useState } from 'react';
import BarChart from './charts/barChart';

export default function Downloaddata() {
  const [graphData, setGraphData] = useState(null);

  useEffect(() => {
    teamgraph();
  }, []);

  const handleStudentClick = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/professor/professorData', {
        method: 'GET',
        headers: {}
      });

      const data = await res.json();

      const Ndata = data.map(student => {
        const {_id,__v, ...rest } = student;
        return rest;
      });

      console.log(Ndata);

      // Create CSV content and download the file
      downloadCSV(Ndata);
    } catch (err) {
      console.log(err.message);
    }
  };

  const convertToCSV = (objArray) => {
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
  
    // Header row
    for (let i = 0; i < Object.keys(array[0]).length; i++) {
      str += Object.keys(array[0])[i] + ",";
    }
    str = str.slice(0, -1);
    str += '\r\n';
  
    // Data rows
    for (let i = 0; i < array.length; i++) {
      let line = '';
      for (let index in array[i]) {
        if (line !== '') line += ',';
        // Check if the value is an array
        if (Array.isArray(array[i][index])) {
          // Convert array to string and keep it within one cell
          line += `"${array[i][index].join(', ')}"`;
        } else {
          line += array[i][index];
        }
      }
      str += line + '\r\n';
    }
    return str;
  };

  // Function to download CSV file
  const downloadCSV = (data) => {
    const csvContent = convertToCSV(data);
    const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'students.csv');
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link);
  };

  const teamgraph = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/team/teamgraph', {
        method: 'GET',
        headers: {}
      });

      const data = await res.json();
      console.log(data);
      setGraphData(data); // Set the data to state

    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className='main-content w-full'>
      <div className='absolute max-sm:mt-16 top-0 left-0 w-full h-full flex justify-center items-center'>
      <div className=" rounded-lg p-6 bg-gray-100 bg-opacity-95 flex flex-col justify-center gap-2 shadow-md w-/12 md:w-8/12 relative">
        <div className='flex justify-between items-center text-xl border-b-2 border-solid'>
          <h1>Data of students with No team</h1>
          <button className='bg-green-500 hover:bg-green-700 text-white font-bold my-2 py-2 px-4 rounded'>Download</button>
        </div>
        <div className='flex justify-between items-center text-xl border-b-2 border-solid'>
          <h1>List of Projects not Allocated</h1>
          <button className='bg-green-500 hover:bg-green-700 text-white my-2 font-bold py-2 px-4 rounded'>Download</button>
        </div>
        <div className='flex justify-between items-center text-xl border-b-2 border-solid'>
          <h1>Professor Progress</h1>
          <button className='bg-green-500 hover:bg-green-700 text-white my-2 font-bold py-2 px-4 rounded' onClick={handleStudentClick}>Download</button>
        </div>
        <div className='flex justify-between items-center text-xl'>
          <h1>All Project Details</h1>
          <button className='bg-green-500 hover:bg-green-700 text-white my-2 font-bold py-2 px-4 rounded'>Download</button>
        </div>
        

      </div>
      </div>




      {/* <button onClick={handleStudentClick}>Submit</button> */}
    </div>
  );
}
