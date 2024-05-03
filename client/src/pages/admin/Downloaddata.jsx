import React from 'react';

export default function Downloaddata() {

  const handleStudentClick = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/student/downloaddata', {
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

  return (
    <div className='main-content'>
      <button onClick={handleStudentClick}>Submit</button>
    </div>
  );
}
