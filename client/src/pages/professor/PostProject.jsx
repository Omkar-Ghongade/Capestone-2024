import React, { useState } from 'react';
import "./Navbar.css";

export default function PostProject() {
  const [name, setProjectName] = useState('');
  const [description, setProjectDescription] = useState('');
  const [domains, setDomains] = useState({
    AIML: false,
    DataScience: false,
    CyberSecurity: false,
    VLSI: false,
    DeepLearning: false
  });
  const [minteamsize, setMinTeamSize] = useState('');
  const [maxteamsize, setMaxTeamSize] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleCheckboxChange = (domain) => {
    setDomains(prevDomains => ({
      ...prevDomains,
      [domain]: !prevDomains[domain]
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const selectedDomains = Object.keys(domains).filter(domain => domains[domain]);
    const professor = localStorage.getItem('professorName');
    const formData = {
      name,
      professor,
      description,
      domains: selectedDomains,
      minteamsize,
      maxteamsize
    };
    const api = import.meta.env.VITE_backend;
    console.log(selectedDomains);

    // const isAnyDomainChecked = Object.values(domains).some(domain => domain);

    if (selectedDomains.length===0) {
      
      setErrorMessage('Please select at least one domain.');
      return;
    }

    if(minteamsize > maxteamsize){
      console.log(minteamsize > maxteamsize)
      setErrorMessage('Minimum team size is greater than Maximum team size');
      return;
    }
    

    try {
      const res = await fetch(`${api}/api/project/createproject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        // Handle error response
        const errorMessage = await res.json();
        throw new Error(errorMessage.message);
      }

      // If successful, clear the form
      setProjectName('');
      setProjectDescription('');
      setDomains({
        AIML: false,
        DataScience: false,
        CyberSecurity: false,
        VLSI: false,
        DeepLearning: false
      });
      setMinTeamSize('');
      setMaxTeamSize('');
      setErrorMessage('');

      // Handle other actions after successful submission
      const data = await res.json();
      console.log(data);
    } catch (err) {
      // Log error and display error message
      console.log(err);
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="main-content w-full mx-auto p-6 bg-white rounded-lg shadow-xl" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }} >
      <h2 className="text-2xl font-bold mb-4">Post a Project</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Name of Project:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setProjectName(e.target.value)}
            className="border rounded-md border-gray-300 px-2 py-1 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Description of Project:</label>
          <textarea
            value={description}
            onChange={(e) => setProjectDescription(e.target.value)}
            className="border rounded-md border-gray-300 px-2 py-1 w-full"
            required
          />
        </div>
        <div className="flex flex-row max-md:flex-col gap-4 mb-4">
          <label className="block mb-1">Domains:</label>
          {Object.keys(domains).map((domain) => (
            <label key={domain} className="block mb-2">
              <input
                type="checkbox"
                checked={domains[domain]}
                onChange={() => handleCheckboxChange(domain)}
                className="mr-2"
              />
              {domain}
            </label>
          ))}
        </div>
        <div className='flex flex-row'>
          <div className="mb-4 mr-4">
            <label className="block mb-1">Minimum Team Size:</label>
            <input
              type="number"
              value={minteamsize}
              onChange={(e) => setMinTeamSize(e.target.value)}
              className="border rounded-md border-gray-300 px-2 py-1 w-full"
              required
              min="1" max="4"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Maximum Team Size:</label>
            <input
              type="number"
              value={maxteamsize}
              onChange={(e) => setMaxTeamSize(e.target.value)}
              className="border rounded-md border-gray-300 px-2 py-1 w-full"
              required
              min="1" max="4"
            />
          </div>
        </div>
        <button type="submit" className=" bg-[#272715] text-white px-4 py-2 rounded hover:bg-blue-600">
          Post Project
        </button>
        {errorMessage && <div className="text-red-500  my-4">{errorMessage}</div>}
      </form>
    </div>
  );
}
