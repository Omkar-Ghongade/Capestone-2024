import React, { useEffect, useState } from 'react';
import Footer from './Footer';
import { MdContentCopy } from "react-icons/md";

export default function TeamFormation() {
  const [teamData, setTeamData] = useState(null);
  const [teamCode, setTeamCode] = useState('');
  const [teamCreatedOrJoined, setTeamCreatedOrJoined] = useState(false);
  const [teamSubmitButton, setTeamSubmitButton] = useState(false);
  const [teamDeleteButton, setTeamDeleteButton] = useState(false);
  const [showSubmitAlert, setShowSubmitAlert] = useState(false);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const api = import.meta.env.VITE_backend;

  useEffect(() => {
    isinTeam();
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => console.error('Failed to copy:', err));
  };

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
      setTeamSubmitButton(false);
      setTeamDeleteButton(false);
      setShowSubmitAlert(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCancelSubmit = () => {
    setShowSubmitAlert(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <img 
          src="https://indiaeducationdiary.in/wp-content/uploads/2020/07/SRMAP-LOGO.jpg" 
          alt="Loading..." 
          style={{ width: "200px", height: "auto" }} 
        />
      </div>
    );
  }

  return (
    <>
      <div className='  main-content mt-10 sm:mt-28 w-11/12 sm:w-3/12 mx-auto flex flex-col p-8 rounded-lg shadow-xl bg-white border-solid border-2 self-center mb-11' style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
        {!teamCreatedOrJoined && (
            <div className='mb-4 h-1/2 pt-2 flex flex-col '>
              <h2 className=' h-1/3 text-lg font-bold py-2'>Create Your Own Team</h2>
              <h2 className=' h-1/3 text-md pb-6'> Share the unique team code with potential teammates for them to join. </h2>
              <button
                onClick={handleCreateTeam}
                className='h-1/3 w-full sm:w-2/3 bg-[#4D4D29] text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-[#535353]'
              >
                Create Team
              </button>
            </div>
        )}

        {!teamCreatedOrJoined && (
          <div className='mb-4'>
            <h2 className='text-lg font-bold mt-6 mb-4'>Join a Team</h2>
            <input
              type='text'
              placeholder='Enter team code'
              value={teamCode}
              onChange={(e) => setTeamCode(e.target.value)}
              className='border border-gray-300 px-3 py-2 rounded focus:outline-none focus:shadow-outline w-full'
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault(); // Prevent form submission
                  handleJoinTeam(); // Call the join team function
                }
              }}
            />
            <button
              onClick={handleJoinTeam}
              className='mt-2 w-full bg-[#4D4D29] text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-[#535353]'
            >
              Join Team
            </button>
          </div>
        )}
        {teamData && (
          <div className='mt-8 p-8 rounded-lg bg-white mb-8'>
            <h2 className='mt-0.5 text-lg font-bold mb-2'>Team Information</h2>
            <div className='flex items-center'>
              <p className='mb-2 mr-2 pr-2'>Team Member: {teamData.teamcode}</p>
              <div className="logo-container" onClick={() => copyToClipboard(teamData.teamcode)}>
                <MdContentCopy />
              </div>
            </div>
            {teamData.teammembers.map((member, index) => (
              <p key={index} className='mb-1'>Creator: {member}</p>
            ))}

            {copied && <p className="copied-message">Code copied to clipboard!</p>}
          </div>
        )}
        {teamSubmitButton && (
          <button
            onClick={handleSubmitTeam}
            className='w-full bg-[#4D4D29] text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-[#535353]'
          >
            Submit Team
          </button>
        )}
        {teamDeleteButton && (
          <button
            onClick={handleDeleteTeam}
            className='w-full bg-[#4D4D29] text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-[#535353]'
          >
            Delete Team
          </button>
        )}

        {showSubmitAlert && (
          <div className="submit-alert-overlay fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
            <div className="submit-alert-box bg-white p-4 rounded-lg shadow-md">
              <p className="text-lg text-center font-semibold mb-4">Are you sure you want to submit the team?</p>
              <p className='text-lg text-center font-semibold text-red-700 mb-4'>The members cannot join any other team once submitted</p>
              <div className="flex justify-center">
                <button onClick={handleConfirmSubmit} className="bg-blue-500 text-white px-4 py-2 rounded mr-4">Yes</button>
                <button onClick={handleCancelSubmit} className="bg-gray-400 text-gray-800 px-4 py-2 rounded">No</button>
              </div>
            </div>
          </div>
        )}
      </div> 
      <div className='fixed bottom-0 w-full'>
        {/* <Footer/> */}
      </div>
    </>
  );
}
