import React, { useEffect, useState } from 'react';

export default function TeamFormation() {
  const [teamData, setTeamData] = useState(null);
  const [teamCode, setTeamCode] = useState('');
  const [teamCreatedOrJoined, setTeamCreatedOrJoined] = useState(false);

  useEffect(() => {
    isinTeam();
  }, []);

  const handleCreateTeam = async () => {
    try{
      const rollNumber=localStorage.getItem('rollNumber');
      const response = await fetch('http://localhost:3000/api/team/createTeam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({studentId:rollNumber}),
      });
      const data = await response.json();
      console.log(data);
      setTeamData(data);
      setTeamCreatedOrJoined(true);
    }catch(err){
      console.log(err);
    }
  };

  const handleJoinTeam = async () => {
    try{
      const rollNumber=localStorage.getItem('rollNumber');
      const response = await fetch('http://localhost:3000/api/team/joinTeam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({studentId:rollNumber,teamcode:teamCode}),
      });
      const data = await response.json();
      console.log(data);
      setTeamData(data);
      setTeamCreatedOrJoined(true);
    }catch(err){
      console.log(err);
    }
  };

  const isinTeam = async () => {
    try{
      const rollNumber=localStorage.getItem('rollNumber');
      const response = await fetch('http://localhost:3000/api/team/isinTeam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({studentId:rollNumber}),
      });
      const data = await response.json();
      if(data){
        setTeamData(data);
        setTeamCreatedOrJoined(true);
      }
    }catch(err){
      console.log(err);
    }
  }

  const handleDeleteTeam = async () => {
    try{
      const response = await fetch('http://localhost:3000/api/team/deleteTeam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({teamcode:teamData.teamcode}),
      });
      const data = await response.json();
      console.log(data);
      setTeamData(null);
      setTeamCreatedOrJoined(false);
    }catch(err){
      console.log(err);
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      {!teamCreatedOrJoined && (
        <div style={{ marginRight: '10px' }}>
          <button onClick={handleCreateTeam}>Create Team</button>
        </div>
      )}
      {!teamCreatedOrJoined && (
        <div>
          <input
            type="text"
            placeholder="Enter team code"
            value={teamCode}
            onChange={(e) => setTeamCode(e.target.value)}
          />
          <button onClick={handleJoinTeam}>Join Team</button>
        </div>
      )}
      {teamData && (
        <div>
          <h2>Team Information</h2>
          <p>Team Code: {teamData.teamcode}</p>
          {teamData.teammembers.map((member, index) => (
            <p key={index}>Member: {member}</p>
          ))}
          <button onClick={handleDeleteTeam}>Delete Team</button>
        </div>
      )}
    </div>
  );
}
