import React, { useEffect, useState } from 'react';
import BarChart from './charts/barChart';
import PieChart from './charts/pieChart';

export default function MainHome() {
  const [graphData, setGraphData] = useState(null);
  const [projectGraphData, setProjectGraphData] = useState(null);
  const [domainData, setDomainData] = useState(null);
  const [details, setDetails] = useState(null);  // Initialize as null

  const api = import.meta.env.VITE_backend;

  useEffect(() => {
    teamgraph();
    teamprojectgraph();
    projectdomains();
    getdetails();
  }, []);

  const teamgraph = async () => {
    const res = await fetch(`${api}/api/team/teamgraph`);
    const data = await res.json();
    setGraphData(data);
  };

  const teamprojectgraph = async () => {
    const res = await fetch(`${api}/api/team/teamprojectgraph`);
    const data = await res.json();
    setProjectGraphData(data);
  };

  const projectdomains = async () => {
    const res = await fetch(`${api}/api/project/getprojectspecs`, { method: 'POST' });
    const data = await res.json();
    setDomainData(data);
  };

  const getdetails = async () => {
    const res = await fetch(`${api}/api/auth/getalldetails`);
    const data = await res.json();
    setDetails(data);
  };

  const renderTable = () => {
    if (!details) return null;  // Ensure details is not null before proceeding

    const detailEntries = Object.entries(details);  // Convert details object to an array of entries
    return (
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Attribute</th>
            <th className="border px-4 py-2">Count</th>
          </tr>
        </thead>
        <tbody>
          {detailEntries.map(([key, value], index) => (
            <tr key={key} className={`bg-${index % 2 === 0 ? 'gray-100' : 'white'}`}>
              <td className="border px-4 py-2">{key}</td>
              <td className="border px-4 py-2">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="main-content font-sans flex h-screen">
      <div className="flex-1 flex flex-col">
        <div>{graphData && <BarChart graphData={graphData} />}</div>
        <div>{projectGraphData && <BarChart graphData={projectGraphData} />}</div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-5">
          {domainData && <PieChart graphData={domainData} />}
        </div>
        <div className="flex-1 p-5">
          {renderTable()}
        </div>
      </div>
    </div>
  );
}
