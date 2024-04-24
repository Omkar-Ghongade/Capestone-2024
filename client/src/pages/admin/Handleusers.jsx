import React, { useState, useEffect } from 'react';

export default function Handleusers() {
  const [file, setFile] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const api = import.meta.env.VITE_backend;

  useEffect(() => {
    displayallusers();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const response = await fetch(`${api}/api/auth/uploadUsers`, {
          method: 'POST',
          body: formData
        });
        if (response.ok) {
          console.log('File uploaded successfully');
          // Refresh the user list after successful upload
          displayallusers();
        } else {
          throw new Error('Failed to upload file');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const displayallusers = async () => {
    try {
      const response = await fetch(`${api}/api/auth/getallusers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error getting users:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = users.filter(user =>
    user.emailid.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='main-content'>
      <h1>Overview</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".xlsx"
          onChange={handleFileChange}
        />
        <button type="submit">Submit</button>
      </form>
      <div>
        <h2>Users</h2>
        <input
          type="text"
          placeholder="Search by email"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <ul>
          {filteredUsers.map(user => (
            <li key={user.id}>
              <span>{user.emailid}</span>
              <span>{user.role}</span>
              {/* Add more user properties as needed */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
