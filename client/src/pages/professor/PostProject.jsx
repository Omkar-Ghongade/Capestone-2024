import React, { useState } from 'react';

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

  const handleCheckboxChange = (domain) => {
    setDomains({
      ...domains,
      [domain]: !domains[domain]
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const selectedDomains = Object.keys(domains).filter(domain => domains[domain]);
    const professor=localStorage.getItem('professorName');
    const formData = {
      name,
      professor,
      description,
      domains: selectedDomains,
      minteamsize,
      maxteamsize
    };

    console.log(formData);

    try{
      const res=await fetch('http://localhost:3000/api/project/createproject',{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(formData)
      })
      const data=await res.json();
      console.log(data);
    }catch(err){
      console.log(err);
    }

    setTimeout(() => {
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
    }, 2000);
  };

  return (
    <div>
      <h2>Post a Project</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name of Project:
          <input
            type="text"
            value={name}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Description of Project:
          <textarea
            value={description}
            onChange={(e) => setProjectDescription(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Domains:
          <br />
          {Object.keys(domains).map((domain) =>(
            <label key={domain}>
              <input
                type="checkbox"
                checked={domains[domain]}
                onChange={() => handleCheckboxChange(domain)}
              />
              {domain}
            </label>
          ))}
        </label>
        <br />
        <label>
          Minimum Team Size:
          <input
            type="number"
            value={minteamsize}
            onChange={(e) => setMinTeamSize(e.target.value)}
            required
            min="1"
          />
        </label>
        <br />
        <label>
          Maximum Team Size:
          <input
            type="number"
            value={maxteamsize}
            onChange={(e) => setMaxTeamSize(e.target.value)}
            required
            max="4"
          />
        </label>
        <br />
        <button type="submit">Post Project</button>
      </form>
    </div>
  );
}
