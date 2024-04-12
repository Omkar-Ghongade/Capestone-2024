import React, { useEffect, useState } from 'react';
import "./Navbar.css"


export default function TeamFormation() {
  const [teamData, setTeamData] = useState(null);
  const [teamCode, setTeamCode] = useState('');
  const [teamCreatedOrJoined, setTeamCreatedOrJoined] = useState(false);
  const [teamSubmitButton, setTeamSubmitButton] = useState(false);
  const [teamDeleteButton, setTeamDeleteButton] = useState(false);

  useEffect(() => {
    isinTeam();
  }, []);

  const handleCreateTeam = async () => {
    try {
      const rollNumber = localStorage.getItem('rollNumber');
      const response = await fetch('http://localhost:3000/api/team/createTeam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentId: rollNumber }),
      });
      const data = await response.json();
      console.log(data);
      setTeamData(data);
      setTeamCreatedOrJoined(true);
    } catch (err) {
      console.log(err);
    }
  };

  const handleJoinTeam = async () => {
    try {
      const rollNumber = localStorage.getItem('rollNumber');
      const response = await fetch('http://localhost:3000/api/team/joinTeam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentId: rollNumber, teamcode: teamCode }),
      });
      const data = await response.json();
      setTeamData(data);
      setTeamCreatedOrJoined(true);
    } catch (err) {
      console.log(err);
    }
  };

  const isinTeam = async () => {
    try {
      const rollNumber = localStorage.getItem('rollNumber');
      const response = await fetch('http://localhost:3000/api/team/isinTeam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentId: rollNumber }),
      });
      const data = await response.json();
      if (data) {
        setTeamData(data);
        console.log(data);
        if (data.submitted === false && data.teammembers[0] === rollNumber && data.teammembers.length >= 2)
          setTeamSubmitButton(true);
        if (data.submitted === false && data.teammembers[0] === rollNumber)
          setTeamDeleteButton(true);
        setTeamCreatedOrJoined(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteTeam = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/team/deleteTeam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamcode: teamData.teamcode }),
      });
      const data = await response.json();
      console.log(data);
      setTeamData(null);
      setTeamSubmitButton(false);
      setTeamDeleteButton(false);
      setTeamCreatedOrJoined(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmitTeam = async () => {
    console.log('submitting team');
    try {
      const response = await fetch('http://localhost:3000/api/team/submitTeam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamcode: teamData.teamcode }),
      });
      const data = await response.json();
      console.log(data);
      setTeamSubmitButton(false);
      setTeamDeleteButton(false);
      console.log('Team submitted');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='main-content flex flex-col mx-auto p-8 rounded-lg shadow-xl bg-white border-solid border-2'>
      {!teamCreatedOrJoined && (
        <div className='mb-4 h-1/2 pt-2 flex flex-col '>
          <h2 className=' h-1/3 text-lg font-bold py-2'>Create Your Own Team</h2>
          <h2 className=' h-1/3 text-md pb-6'> Share the unique team code with potential teammates for them to join. </h2>
          <button
            onClick={handleCreateTeam}
            className='h-1/3 w-1/3 max-sm:w-5/12 sm bg-blue-500 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-blue-600'
          >
            Create Team
          </button>
        </div>
      )}

<div className="h-0.5 relative ">
  <div className="absolute left-0 right-0 top-0 bottom-0 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
</div>
      {!teamCreatedOrJoined && (
        <div className='mb-4'>
          <h2 className='text-lg font-bold mt-6 mb-4'> Join a Team </h2>
          
          <input
            type='text'
            placeholder='Enter team code'
            value={teamCode}
            onChange={(e) => setTeamCode(e.target.value)}
            className='border border-gray-300 px-3 max-md:mb-3 mr-3 py-2 rounded focus:outline-none focus:shadow-outline'
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault(); // Prevent form submission
                handleJoinTeam(); // Call the join team function
              }
            }}
          />
          <button
            onClick={handleJoinTeam}
            className='bg-blue-500 text-white py-2  px-4 rounded focus:outline-none focus:shadow-outline hover:bg-blue-600'
            
          >
            Join Team
          </button>
        </div>
      )}
      {teamData && (
        <div className='mb-4'>
          <h2 className='text-lg font-bold mb-2'>Team Information</h2>
          <p className='mb-2'>Team Code: {teamData.teamcode}</p>
          {teamData.teammembers.map((member, index) => (
            <p key={index} className='mb-1'>Creator: {member}</p>
          ))}
        </div>
      )}
      {teamSubmitButton && (
        <div className='mb-4'>
          <button
            onClick={handleSubmitTeam}
            className='bg-blue-500 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-blue-600'
          >
            Submit Team
          </button>
        </div>
      )}
      {teamDeleteButton && (
        <div className='mb-4'>
          <button
            onClick={handleDeleteTeam}
            className='bg-red-500 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-red-600'
          >
            Delete Team
          </button>
        </div>
      )}
    </div>
  );
}
