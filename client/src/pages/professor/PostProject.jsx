import React, { useState, useEffect } from 'react';
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
  const [maxProfessorProjects, setMaxProfessorProjects] = useState(0);
  const [professorProjectCount, setProfessorProjectCount] = useState(0);
  const [limits , setLimits] = useState(null);

  const api = import.meta.env.VITE_backend;

  useEffect(() => {
    const fetchProfessorProjects = async () => {
      try {
        const res = await fetch(`${api}/api/project/getprofessorproject`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name: localStorage.getItem('professorName') })
        })
        const data = await res.json();
        setProfessorProjectCount(data.length);
        console.log(professorProjectCount);
      } catch (err) {
        console.error(err);
      }
    };

    const getLimits = async () => {
      try {
        const res = await fetch(`${api}/api/admin/getlimits`);
        const data = await res.json();
        setLimits(data);
        setMaxProfessorProjects(data.maxprofessorproject);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProfessorProjects();
    getLimits();
  }, [api]);

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

    if (selectedDomains.length === 0) {
      setErrorMessage('Please select at least one domain.');
      return;
    }

    if (minteamsize > maxteamsize) {
      setErrorMessage('Minimum team size is greater than Maximum team size');
      return;
    }

    if (professorProjectCount >= maxProfessorProjects) {
      setErrorMessage(`You have reached the maximum number of projects (${maxProfessorProjects}).`);
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

      const data = await res.json();
      console.log(data);
      window.location.reload();
    } catch (err) {
      console.log(err);
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="main-content w-full mx-auto p-6 bg-white rounded-lg shadow-xl" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
      <h2 className="text-2xl font-bold mb-4">Post a Project</h2>
      {professorProjectCount >= maxProfessorProjects ? (
        <div className="text-red-500 my-4">
          Your limit to post projects is exceeded. You cannot post more than {maxProfessorProjects} projects.
        </div>
      ) : (
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
                min={limits.minteamsize} max={limits.maxteamsize}
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
                min={limits.minteamsize} max={limits.maxteamsize}
              />
            </div>
          </div>
          <button type="submit" className="bg-[#272715] text-white px-4 py-2 rounded hover:bg-blue-600">
            Post Project
          </button>
          {errorMessage && <div className="text-red-500 my-4">{errorMessage}</div>}
        </form>
      )}
    </div>
  );
}
