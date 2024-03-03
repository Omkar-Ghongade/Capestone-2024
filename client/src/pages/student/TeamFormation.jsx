import React from 'react';

export default function TeamFormation() {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ marginRight: '10px' }}>
        <button>Create Team</button>
      </div>
      <div>
        <input type="text" placeholder="Enter team code" />
        <button>Join Team</button>
      </div>
    </div>
  );
}
