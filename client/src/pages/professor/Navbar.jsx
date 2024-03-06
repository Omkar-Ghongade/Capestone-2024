import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/manage-applications">Manage Applications</Link></li>
        <li><Link to="/post-project">Post Project</Link></li>
        <li><Link to="/view-reports">View Reports</Link></li>
        <li><Link to="/my-projects">My Projects</Link></li>
        <li><Link to="/logout">Logout</Link></li>
      </ul>
    </nav>
  );
}
