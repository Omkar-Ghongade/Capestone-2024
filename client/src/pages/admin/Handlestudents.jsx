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
  const [editedUserName, setEditedUserName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [editedRollNumber, setEditedRollNumber] = useState('');
  const [editedSchool, setEditedSchool] = useState('');
  const [editedStream, setEditedStream] = useState('');
  const [editedSemester, setEditedSemester] = useState('');
  const [editedSection, setEditedSection] = useState('');
  const [editedGender, setEditedGender] = useState('')
  const [editedContactNumber, setEditedContactNumber] = useState('');



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
    setEditedUserName(user.name);
    setEditedEmail(user.emailid);
    setEditedRollNumber(user.rollNumber);
    setEditedSchool(user.school);
    setEditedStream(user.stream);
    setEditedSemester(user.semester);
    setEditedSection(user.section);
    setEditedGender(user.gender);
    setEditedContactNumber(user.contactNumber);
    console.log('Edit user:', user);
  };

  const handleSave = async (user) => {
    try{
      const res = await fetch(`${api}/api/auth/editstudent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({user:editingUser,
          name: editedUserName,
          emailid: editedEmail,
          rollNumber: editedRollNumber,
          school: editedSchool,
          stream: editedStream,
          semester: editedSemester,
          section: editedSection,
          gender: editedGender,
          contactNumber: editedContactNumber,
        })
      });
      if (res.ok) {
        console.log('User edited successfully');
        displayallusers();
        setEditingUser(null);
      } else {
        throw new Error('Failed to edit user');
      }
    }catch(err){
        res.status(404).json({message:err.message});
    }
  };

  return (
    <div className='main-content'>
      <h1 className="text-3xl font-bold mb-4 ml-2">Handle Students</h1>
      <form onSubmit={handleSubmit} className="mb-8 ml-2">
        <input
          type="file"
          accept=".xlsx"
          onChange={handleFileChange}
          className="mr-2"
        />
        <button type="submit" className="bg-[#272715] hover:bg-gray-700 text-white font-bold py-2 px-4">
          Submit
        </button>
      </form>
      <div>
        <h2 className="text-2xl font-semibold mb-4 ml-2">Users</h2>

        <div className="mb-4 ml-2">
          <button onClick={handleAddUser} className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 mr-2">
            Add User
          </button>
        </div>
        {showAddForm && (
          <form onSubmit={handleNewUserSubmit} className="mb-4 flex flex-col gap-2 ml-2">
            <div>
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
            </div>
            <div className='flex gap-2'>
            <button type="button" onClick={handleCancelAddUser} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ">
              Cancel
            </button>
            <button type="submit" className="bg-[#272715] hover:bg-gray-800 text-white font-bold py-2 px-4 rounded">
              Submit
            </button>
            
            </div>
          </form>
        )}
        <input
          type="text"
          placeholder="Search any field"
          value={searchQuery}
          onChange={handleSearchChange}
          className="mb-4 p-2 border border-gray-300 rounded-md ml-2"
        />
        
        <table className="w-full text-center border-collapse border border-gray-300">
        <thead>
            <tr className="bg-[#272715]  text-white">
              <th className="py-2 px-4 border border-2 border-white border-t-0 border-t-0  border-b-0">Name</th>
              <th className="py-2 px-4 border border-2 border-white border-t-0 border-b-0">Email Id</th>
              <th className="py-2 px-4 border border-2 border-white border-t-0 border-b-0">Roll No</th>
              <th className="py-2 px-4 border border-2 border-white border-t-0 border-b-0">Stream</th>
              <th className="py-2 px-4 border border-2 border-white border-t-0 border-b-0">Section</th>
              <th className="py-2 px-4 border border-2 border-white border-t-0 border-b-0">Actions</th>
            </tr>
          </thead>
        <tbody className="bg-gray-100 font-semibold">
        {filteredUsers.map(user => (
          <tr key={user.id} className='hover:bg-gray-200' >
          <td className="py-2 px-4 border border-2 border-white border-t-0 border-b-0">
            {editingUser === user ? (
              <input
              type="text"
              value={editedUserName}
              onChange={(e) => setEditedUserName(e.target.value)}
              className="p-2 border border-gray-300 rounded-md"
            />
            ) : (<span>{user.name}</span>)}
          </td>

          <td className="py-2 px-4 border border-2 border-white border-t-0 border-b-0">
            {editingUser === user ? (
              <input
              type="text"
              value={editedEmail}
              onChange={(e) => setEditedEmail(e.target.value)}
              className="p-2 border border-gray-300 rounded-md"
            />
            ) : (<span>{user.emailid}</span>)}
          </td>

          <td className="py-2 px-4 border border-2 border-white border-t-0 border-b-0">
            {editingUser === user ? (
              <input
              type="text"
              value={editedRollNumber}
              onChange={(e) => setEditedRollNumber(e.target.value)}
              className="p-2 border border-gray-300 rounded-md"
            />
            ) : (<span>{user.rollNumber}</span>)}
          </td>
          <td className="py-2 px-4 border border-2 border-white border-t-0 border-b-0">
            {editingUser === user ? (
              <select
              value={editedStream}
              onChange={(e) => editedStream(e.target.value)}
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
            ) : (<span>{user.stream}</span>)}
          </td>
          <td className="py-2 px-4 border border-2 border-white border-t-0 border-b-0">
            {editingUser === user ? (
              <select
              value={editedSection}
              onChange={(e) => editedSection(e.target.value)}
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
            ) : (<span>{user.section}</span>)}
          </td>
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
