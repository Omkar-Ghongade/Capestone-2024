import React, { useState, useEffect } from 'react';

export default function Handleusers() {
  const [file, setFile] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editedEmail, setEditedEmail] = useState('');
  const [editedRole, setEditedRole] = useState('');
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

  const handleEdit = (user) => {
    setEditingUser(user);
    setEditedEmail(user.emailid);
    setEditedRole(user.role);
  };

  const handleDelete = (user) => {
    try{
      const res = fetch(`${api}/api/auth/deleteuser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ emailid: user.emailid })
      });
      console.log('User deleted successfully');
    }catch(err){
        console.log(err);
    }
  };

  const handleSave = () => {
    console.log('Edited email:', editedEmail);
    console.log('Edited role:', editedRole);
    // You can add logic here to update the user data in the backend
    setEditingUser(null);
    setEditedEmail('');
    setEditedRole('');
  };

  const filteredUsers = users.filter(user =>
    user.emailid.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='main-content'>
      <h1 className="text-3xl font-bold mb-4">Overview</h1>
      <form onSubmit={handleSubmit} className="mb-8">
        <input
          type="file"
          accept=".xlsx"
          onChange={handleFileChange}
          className="mr-2"
        />
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Submit
        </button>
      </form>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Users</h2>
        <input
          type="text"
          placeholder="Search by email"
          value={searchQuery}
          onChange={handleSearchChange}
          className="mb-4 p-2 border border-gray-300 rounded-md"
        />
        <ul>
          {filteredUsers.map(user => (
            <li key={user.id} className="flex items-center justify-between mb-4">
              {editingUser === user ? (
                <div className="flex items-center">
                  <input
                    type="text"
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                    className="mr-2 p-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    value={editedRole}
                    onChange={(e) => setEditedRole(e.target.value)}
                    className="mr-2 p-2 border border-gray-300 rounded-md"
                  />
                  <button onClick={handleSave} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Save
                  </button>
                </div>
              ) : (
                <div>
                  <span>{user.emailid}</span>
                  <span>{user.role}</span>
                  <div>
                    <button onClick={() => handleEdit(user)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(user)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
