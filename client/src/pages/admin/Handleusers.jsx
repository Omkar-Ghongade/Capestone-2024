import { Tooltip } from 'chart.js';
import React, { useState, useEffect } from 'react';

export default function Handleusers() {
  const [file, setFile] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('student');
  const [editingUser, setEditingUser] = useState(null);
  const [editedEmail, setEditedEmail] = useState('');
  const [editedRole, setEditedRole] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('student'); // Default role

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

  const handleDelete = async (user) => {
    try {
      const res = await fetch(`${api}/api/auth/deleteuser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ emailid: user.emailid })
      });
      if (res.ok) {
        console.log('User deleted successfully');
        // Refresh the user list after successful deletion
        displayallusers();
      } else {
        throw new Error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleSave = async () => {
    console.log('Edited email:', editedEmail);
    console.log('Edited role:', editedRole);
    try {
      const res = await fetch(`${api}/api/auth/edituser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pemailid: editingUser.emailid, emailid: editedEmail, role: editedRole })
      });
      if (res.ok) {
        console.log('User edited successfully');
        // Refresh the user list after successful edit
        displayallusers();
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
    setNewUserRole('student');
  };

  const handleNewUserSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${api}/api/auth/adduser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ emailid: newUserEmail, role: newUserRole })
      });
      if (response.ok) {
        console.log('User added successfully');
        // Refresh the user list after successful addition
        displayallusers();
        setShowAddForm(false);
        setNewUserEmail('');
        setNewUserRole('student');
      } else {
        throw new Error('Failed to add user');
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.emailid.toLowerCase().includes(searchQuery.toLowerCase()) && (user.role.toLowerCase() === selectedRole.toLowerCase()) && user.role !== 'admin'
  );

  return (
    <div className='main-content'>
      <h1 className="text-3xl font-bold mb-4">Handle Users</h1>
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
        <div className="mb-4">
          <button onClick={handleAddUser} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2">
            Add User
          </button>
        </div>
        {showAddForm && (
          <form onSubmit={handleNewUserSubmit} className="mb-4">
            <div className='flex flex-col'>
            <input
              type="text"
              placeholder="Enter email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              className="mr-2 p-2 border border-gray-300 rounded-md"
            />
            <select
              value={newUserRole}
              onChange={(e) => setNewUserRole(e.target.value)}
              className="mr-2 p-2 border border-gray-300 rounded-md"
            >
              <option value="student">Student</option>
              <option value="professor">Professor</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Submit
            </button>
            <button type="button" onClick={handleCancelAddUser} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2">
              Cancel
            </button>
            </div>
          </form>
        )}
        
        <div className="ml-1">
          <button onClick={() => setSelectedRole('student')} className={` bg-${selectedRole === 'student' ? '[#272715] text-white' : 'gray-200 text-black'}  font-bold py-2 px-4 `}>
            Student
          </button>
          <button onClick={() => setSelectedRole('professor')} className={` bg-${selectedRole === 'professor' ? '[#272715] text-white' : 'gray-200 text-black'}  font-bold py-2 px-4`}>
            Professor
          </button>
        </div>

       
        <table className="w-full text-center border-collapse border border-gray-300">
          <thead>
            <tr className="bg-[#272715]  text-white">
              <th className="py-2 px-4 border border-2 border-white border-t-0 border-t-0  border-b-0">Email ID</th>
              <th className="py-2 px-4 border border-2 border-white border-t-0 border-b-0">Role</th>
              <th className="py-2 px-4 border border-2 border-white border-t-0 border-b-0">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-gray-100 font-semibold">
            {filteredUsers.map(user => (
              <tr key={user.id} className='hover:bg-gray-200' >
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
                  <select
                    value={editedRole}
                    onChange={(e) => setEditedRole(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md"
                  >
                    <option value="student">Student</option>
                    <option value="professor">Professor</option>
                    <option value="admin">Admin</option>
                  </select>
                ) : (
                  <span>{user.role}</span>
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
