import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  }

  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/applied-projects">Applied Projects</Link></li>
        <li><Link to="/professor-profiles">Professor Profiles</Link></li>
        <li><Link to="/projects-list">Projects List</Link></li>
        <li><Link to="/submit-reports">Submit Reports</Link></li>
        <li><Link to="/my-projects">My Projects</Link></li>
        <li><Link to="/team-formation">Team Formation</Link></li>
        <li><button onClick={handleLogout}>Logout</button></li>
      </ul>
    </nav>
  );
}
