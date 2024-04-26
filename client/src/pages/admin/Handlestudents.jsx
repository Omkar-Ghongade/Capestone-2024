import React, { useState, useEffect } from 'react';

export default function Handlestudents() {
  const [file, setFile] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRollNumber, setNewUserRollNumber] = useState('');
  const [newUserSchool, setNewUserSchool] = useState('SEAS');
  const [newUserStream, setNewUserStream] = useState('CSE');
  const [newUserSemester, setNewUserSemester] = useState('');
  const [newUserSection, setNewUserSection] = useState('A');
  const [newUserGender, setNewUserGender] = useState('Male');
  const [newUserContactNumber, setNewUserContactNumber] = useState('');
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
        const response = await fetch(`${api}/api/auth/uploadStudents`, {
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
      const response = await fetch(`${api}/api/auth/getallstudents`, {
        method: 'POST',
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

  const handleAddUser = () => {
    setShowAddForm(true);
  };

  const handleCancelAddUser = () => {
    setShowAddForm(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserRollNumber('');
    setNewUserSchool('SEAS');
    setNewUserStream('CSE');
    setNewUserSemester('');
    setNewUserSection('');
    setNewUserGender('Male');
    setNewUserContactNumber('');
  };

  const handleNewUserSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${api}/api/auth/addstudent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          name: newUserName,
          emailid: newUserEmail,
          rollNumber: newUserRollNumber,
          school: newUserSchool,
          stream: newUserStream,
          semester: newUserSemester,
          section: newUserSection,
          gender: newUserGender,
          contactnumber: newUserContactNumber
        })
      });
      if (response.ok) {
        console.log('User added successfully');
        // Refresh the user list after successful addition
        displayallusers();
        setShowAddForm(false);
        setNewUserName('');
        setNewUserEmail('');
        setNewUserRollNumber('');
        setNewUserSchool('SEAS');
        setNewUserStream('CSE');
        setNewUserSemester('');
        setNewUserSection('');
        setNewUserGender('Male');
        setNewUserContactNumber('');
      } else {
        throw new Error('Failed to add user');
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleDelete = async (user) => {
    try {
      const res = await fetch(`${api}/api/auth/deletestudent`, {
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

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.emailid.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.stream.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.section.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (user) => {
    setEditingUser(user);
    setEditedEmail(user.emailid);
    setEditedRole(user.role);
    console.log('Edit user:', user);
  };

  const handleSaveEdit = async (user) => {
  };

  return (
    <div className='main-content'>
      <h1 className="text-3xl font-bold mb-4">Handle Students</h1>
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
            <input
              type="text"
              placeholder="Enter Name"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              className="mr-2 p-2 border border-gray-300 rounded-md"
            />
            <input
              type="email"
              placeholder="Enter Email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              className="mr-2 p-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              placeholder="Enter Roll Number"
              value={newUserRollNumber}
              onChange={(e) => setNewUserRollNumber(e.target.value)}
              className="mr-2 p-2 border border-gray-300 rounded-md"
            />
            <select
              value={newUserSchool}
              onChange={(e) => setNewUserSchool(e.target.value)}
              className="mr-2 p-2 border border-gray-300 rounded-md"
            >
              <option value="SEAS">SEAS</option>
              {/* Add other schools as options */}
            </select>
            <select
              value={newUserStream}
              onChange={(e) => setNewUserStream(e.target.value)}
              className="mr-2 p-2 border border-gray-300 rounded-md"
            >
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
              <option value="ME">ME</option>
              <option value="CE">CE</option>
              <option value="CHE">CHE</option>
              <option value="BT">BT</option>

            </select>
            <input
              type="text"
              placeholder="Enter Semester"
              value={newUserSemester}
              onChange={(e) => setNewUserSemester(e.target.value)}
              className="mr-2 p-2 border border-gray-300 rounded-md"
            />
            <select
              value={newUserSection}
              onChange={(e) => setNewUserSection(e.target.value)}
              className="mr-2 p-2 border border-gray-300 rounded-md"
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="E">E</option>
              <option value="F">F</option>
              <option value="G">G</option>
              <option value="H">H</option>
              <option value="I">I</option>
              <option value="J">J</option>
              <option value="K">K</option>
              <option value="L">L</option>
            </select>
            <select
              value={newUserGender}
              onChange={(e) => setNewUserGender(e.target.value)}
              className="mr-2 p-2 border border-gray-300 rounded-md"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input
              type="text"
              placeholder="Enter Contact Number"
              value={newUserContactNumber}
              onChange={(e) => setNewUserContactNumber(e.target.value)}
              className="mr-2 p-2 border border-gray-300 rounded-md"
            />
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Submit
            </button>
            <button type="button" onClick={handleCancelAddUser} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2">
              Cancel
            </button>
          </form>
        )}
        <ul>
        {filteredUsers.map(user => (
          <li key={user.id} className="flex items-center justify-between mb-4">
            {editingUser === user ? (
              <form onSubmit={(e) => handleSubmit(e, user)}>
              <div className="flex items-center space-x-4">
                <input type="text" name="name" defaultValue={user.name} placeholder="Name" required className="border border-gray-300 rounded px-3 py-2" />
                <input type="email" name="emailid" defaultValue={user.emailid} placeholder="Email" required className="border border-gray-300 rounded px-3 py-2" />
                <input type="text" name="rollNumber" defaultValue={user.rollNumber} placeholder="Roll Number" required className="border border-gray-300 rounded px-3 py-2" />
                <select name="stream" defaultValue={user.stream} required className="border border-gray-300 rounded px-3 py-2">
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="EEE">EEE</option>
                  <option value="ME">ME</option>
                  <option value="CE">CE</option>
                  <option value="CHE">CHE</option>
                  <option value="BT">BT</option>
                </select>
                <select name="section" defaultValue={user.section} required className="border border-gray-300 rounded px-3 py-2">
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                  <option value="F">F</option>
                  <option value="G">G</option>
                  <option value="H">H</option>
                  <option value="I">I</option>
                  <option value="J">J</option>
                  <option value="K">K</option>
                  <option value="L">L</option>
                </select>
                <input type="text" name="semester" defaultValue={user.semester} placeholder="Semester" required className="border border-gray-300 rounded px-3 py-2" />
                <select name="gender" defaultValue={user.gender} required className="border border-gray-300 rounded px-3 py-2">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <input type="text" name="contactNumber" defaultValue={user.contactNumber} placeholder="Contact Number" required className="border border-gray-300 rounded px-3 py-2" />
                <div className='space-x-2'>
                  <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Save
                  </button>
                </div>
              </div>
            </form>            
            ) : (
              <div className="space-x-4">
                <span>{user.name}</span>
                <span>{user.emailid}</span>
                <span>{user.rollNumber}</span>
                <span>{user.stream}</span>
                <span>{user.section}</span>
                <div className='space-x-2'>
                  <button onClick={() => handleEdit(user)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
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
