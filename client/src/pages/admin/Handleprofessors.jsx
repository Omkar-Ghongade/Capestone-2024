import { Tooltip } from 'chart.js';
import React, { useState, useEffect } from 'react';

export default function Handleusers() {
  const [file, setFile] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserdesignation, setNewUserDesignation] = useState('');

  const [editingUser, setEditingUser] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [editeddesignation, setEditedDesignation] = useState('');
  
  

  const api = import.meta.env.VITE_backend;

  useEffect(() => {
    displayallprofessors();
  }, []);

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const newFile = event.dataTransfer.files[0];  // Only take the first file
    if (newFile) {
      setFile(newFile);
    }
  };

  const handleChange = (event) => {
    const newFile = event.target.files[0];  // Only take the first file
    if (newFile) {
      setFile(newFile);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      console.log('Uploading file:', file);
      const formData = new FormData();
      formData.append('file', file);
      try {
        const response = await fetch(`${api}/api/auth/uploadProfessors`, {
          method: 'POST',
          body: formData
        });
        if (response.ok) {
          console.log('File uploaded successfully');
          displayallprofessors();
        } else {
          throw new Error('Failed to upload file');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const displayallprofessors = async () => {
    try {
      const response = await fetch(`${api}/api/auth/getallprofessors`, {
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
    setEditedName(user.name);
    setEditedDesignation(user.designation);
    
  };

  const handleDelete = async (user) => {
    try {
      const res = await fetch(`${api}/api/auth/deleteprofessor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ emailid: user.emailid })
      });
      if (res.ok) {
        console.log('User deleted successfully');
        // Refresh the user list after successful deletion
        displayallprofessors();
      } else {
        throw new Error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleSave = async () => {
    console.log('Edited email:', editedEmail);
    
    try {
      const res = await fetch(`${api}/api/auth/editprofessor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name:editedName, emailid: editedEmail, designation:editeddesignation})
      });
      if (res.ok) {
        console.log('User edited successfully');
        // Refresh the user list after successful edit
        displayallprofessors();
      } else {
        throw new Error('Failed to edit user');
      }
    } catch (err) {
      console.error(err);
    }
    setEditingUser(null);
    setEditedEmail('');
    setEditedRole('');
  };

  const handleAddUser = () => {
    setShowAddForm(true);
  };

  const handleCancelAddUser = () => {
    setShowAddForm(false);
    setNewUserEmail('');
    
  };

  const handleNewUserSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${api}/api/auth/addprofessor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });
      if (response.ok) {
        console.log('User added successfully');
        // Refresh the user list after successful addition
        displayallprofessors();
        setShowAddForm(false);
        setNewUserEmail('');
      } else {
        throw new Error('Failed to add user');
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.emailid.toLowerCase().includes(searchQuery.toLowerCase()) && user.role !== 'admin'
  );

  return (
    <div className='main-content'>
      <h1 className="text-3xl font-bold mb-4 ml-2">Handle Users</h1>
      <div className='flex justify-center items-center ml-2'>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => document.getElementById('fileInput').click()}
        style={{ width: '60%', height: '200px'}}
        className='border border-solid border-gray-300 rounded-md p-4 cursor-pointer text-center flex items-center justify-center'
      >
        <div>
        { file ?(<div><h1>{file.name}</h1><button onClick={handleSubmit} className="bg-[#272715] hover:bg-gray-700 text-white font-bold py-2 px-4 mt-4">
        Submit Files
      </button></div>) :(<h1>Drag files here or click to select files</h1>)}
        </div>
        
      </div>
      </div>
      <input
        id="fileInput"
        type="file"
        multiple
        onChange={handleChange}
        style={{ display: 'None' }}
      />
      <div>
      
        <h2 className="text-2xl font-semibold mb-4 ml-2">Users</h2>
        <div className="mb-4 ml-2">
          <button onClick={handleAddUser} className="bg-green-700 hover:bg-green-700 text-white font-bold py-2 px-4 mr-2">
            Add User
          </button>
        </div>
        {showAddForm && (
          <form onSubmit={handleNewUserSubmit} className="mb-4 ">
            <div className='ml-2 flex gap-2'>
            <input
              type="text"
              placeholder="Enter Name"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              className=" p-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              placeholder="Enter email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              className=" p-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              placeholder="Enter Designation"
              value={newUserdesignation}
              onChange={(e) => setNewUserDesignation(e.target.value)}
              className=" p-2 border border-gray-300 rounded-md"
            />
            
            <button type="button" onClick={handleCancelAddUser} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
              Cancel
            </button>

            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Submit
            </button>
            
            </div>
          </form>
        )}
        <input
          type="text"
          placeholder="Search by email"
          value={searchQuery}
          onChange={handleSearchChange}
          className="mb-4 p-2 border border-gray-300 rounded-md ml-2"
        />

        <table className="w-full text-center border-collapse border border-gray-300">
          <thead>
            <tr className="bg-[#272715]  text-white">
            <th className="py-2 px-4 border border-2 border-white border-t-0 border-t-0  border-b-0">Name</th>
            <th className="py-2 px-4 border border-2 border-white border-t-0 border-t-0  border-b-0">Email ID</th>
              <th className="py-2 px-4 border border-2 border-white border-t-0 border-t-0  border-b-0">Designation</th>
              <th className="py-2 px-4 border border-2 border-white border-t-0 border-b-0">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-gray-100 font-semibold">
            {filteredUsers.map(user => (
              <tr key={user.id} className='hover:bg-gray-200' >
                <td className="py-2 px-4 border border-2 border-white border-t-0 border-b-0">{editingUser === user ? (
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md"
                  />
                ) : (
                  <span>{user.name}</span>
                )}</td>
                <td className="py-2 px-4 border border-2 border-white border-t-0 border-b-0">{editingUser === user ? (
                  <input
                    type="text"
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md"
                  />
                ) : (
                  <span>{user.emailid}</span>
                )}</td>

                <td className="py-2 px-4 border border-2 border-white border-t-0 border-b-0">{editingUser === user ? (
                  <input
                    type="text"
                    value={editeddesignation}
                    onChange={(e) => setEditedDesignation(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md"
                  />
                ) : (
                  <span>{user.designation}</span>
                )}</td>
                
                <td className="py-2 px-4 border border-2 border-white border-t-0 border-b-0">
                  {editingUser === user ? (
                    <button onClick={handleSave} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                      Save
                    </button>
                  ) : (
                    <div className='flex justify-center gap-2'>
                      <img className='cursor-pointer' onClick={() => handleEdit(user)} width="24" height="24" src="https://img.icons8.com/windows/32/create-new.png" alt="create-new" title='Edit'/>
                      <img className='cursor-pointer' onClick={()=> handleDelete(user)} width="24" height="24" src="https://img.icons8.com/carbon-copy/100/filled-trash.png" alt="filled-trash" title='Delete'/>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  
  
}
