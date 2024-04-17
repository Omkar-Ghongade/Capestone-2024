import React, { useEffect, useState } from 'react';
import Footer from './Footer';


export default function TeamFormation() {
  const [teamData, setTeamData] = useState(null);
  const [teamCode, setTeamCode] = useState('');
  const [teamCreatedOrJoined, setTeamCreatedOrJoined] = useState(false);
  const [teamSubmitButton, setTeamSubmitButton] = useState(false);
  const [teamDeleteButton, setTeamDeleteButton] = useState(false);
  const [showSubmitAlert, setShowSubmitAlert] = useState(false);
  const [loading, setLoading] = useState(true);
  const api = import.meta.env.VITE_backend;

  useEffect(() => {
    isinTeam();
  }, []);

  const handleCreateTeam = async () => {
    try {
      const rollNumber = localStorage.getItem('rollNumber');
      const response = await fetch(`${api}/api/team/createTeam`, {
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
      const response = await fetch(`${api}/api/team/joinTeam`, {
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
      const response = await fetch(`${api}/api/team/isinTeam`, {
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
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleDeleteTeam = async () => {
    try {
      const response = await fetch(`${api}/api/team/deleteTeam`, {
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
    setShowSubmitAlert(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      const response = await fetch(`${api}/api/team/submitTeam`, {
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
      setShowSubmitAlert(false); // Close the alert after submission
    } catch (err) {
      console.log(err);
    }
  };

  const handleCancelSubmit = () => {
    setShowSubmitAlert(false); // Close the alert if canceled
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <img 
          src="https://srmap.edu.in/file/2019/12/Logo-2.png" 
          alt="Loading..." 
          style={{ width: "200px", height: "auto" }} 
        />
      </div>
    );
  }

  return (
    <>
     <div className=' mt-28 flex flex-col p-8 rounded-lg shadow-xl bg-white border-solid border-2 self-center mb-11'>
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
        <div className='mt-8 p-8 rounded-lg bg-white mb-8'>
          <h2 className='mt-0.5 text-lg font-bold mb-2'>Team Information</h2>
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

      {showSubmitAlert && (
        <div className="submit-alert-overlay fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
          <div className="submit-alert-box bg-white p-4 rounded-lg shadow-md">
            <p className="text-lg text-center font-semibold mb-4">Are you sure you want to submit the team?</p>
            <p className='text-lg text-center font-semibold text-red-700 mb-4'> The members cannot join any other team once submitted</p>
            <div className="flex justify-center">
              <button onClick={handleConfirmSubmit} className="bg-blue-500 text-white px-4 py-2 rounded mr-4">Yes</button>
              <button onClick={handleCancelSubmit} className="bg-gray-400 text-gray-800 px-4 py-2 rounded">No</button>
            </div>
          </div>
        </div>
      )}
      </div> 
<div className=''>
<Footer/>
</div>
    </>
  );
}
