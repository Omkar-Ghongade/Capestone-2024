import React, { useEffect, useState } from 'react';
import BarChart from './charts/barChart';
import PieChart from './charts/pieChart';



export default function MainHome() {
  const [graphData, setGraphData] = useState(null);
  const [projectGraphData, setProjectGraphData] = useState(null);
  const [domainData, setDomainData] = useState(null);

  const api = import.meta.env.VITE_backend;

  useEffect(() => {
    teamgraph();
  }, []);

  useEffect(() => {
    teamprojectgraph();
  }, []);

  useEffect(() => {
    projectdomains();
  }, []);

  const teamgraph = async () => {
    try {
      const res = await fetch(`${api}/api/team/teamgraph`, {
        method: 'GET',
        headers: {}
      });

      const data = await res.json();
      console.log(data);
      setGraphData(data); // Set the data to state

    } catch (err) {
      console.log(err.message);
    }
  };

  const teamprojectgraph = async () => {
    try {
      const res = await fetch(`${api}/api/team/teamprojectgraph`, {
        method: 'GET',
        headers: {}
      });

      const data = await res.json();
      console.log(data);
      setProjectGraphData(data); // Set the data to state
    } catch (err) {
      console.log(err.message);
    }
  };

  const projectdomains = async () => {
    try{
      const res = await fetch(`${api}/api/project/getprojectspecs`,{
        method: 'POST',
        headers: {}
      });

      const data = await res.json();
      console.log(data);
      setDomainData(data);
    }catch(err){
      console.log(err.message);
    }
  }


  return (
    <div style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
      <div className='main-content' style={{ display: 'flex', height: '100vh' }} >
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div >
            <h1>Team </h1>
            {graphData && <BarChart graphData={graphData} />}
          </div>
          <div>
            <h2>Student Details</h2>
            {/* Content for the lower student section */}
            {projectGraphData && <BarChart graphData={projectGraphData} />}
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, padding: '20px'}}>
            <h1>Professor</h1>
            {/* Content for the upper professor section */}
            {domainData && <PieChart graphData={domainData} />}
          </div>
          <div style={{ flex: 1, padding: '20px' }}>
            <h2>Professor Details</h2>
            {/* Content for the lower professor section */}
          </div>
        </div>
      </div>
    </div>
  );
}
