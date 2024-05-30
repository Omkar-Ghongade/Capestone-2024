import React, { useEffect, useState } from 'react';
import BarChart from './charts/barChart';
import PieChart from './charts/pieChart';

function ConfirmationModal({ show, onConfirm, onCancel }) {
  if (!show) return null;

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Confirm Submission
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    You cannot edit it once it is submitted. Are you sure you want to proceed?
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onConfirm}
            >
              Yes
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onCancel}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MainHome() {
  const [graphData, setGraphData] = useState(null);
  const [projectGraphData, setProjectGraphData] = useState(null);
  const [domainData, setDomainData] = useState(null);
  const [details, setDetails] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(localStorage.getItem('formSubmitted') === 'true');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [limits, setLimits] = useState({
    maxteamsize: '',
    minteamsize: '',
    maxprofessorproject: '',
    maxstudentapplications: ''
  });
  const [submittedLimits, setSubmittedLimits] = useState(null);

  const api = import.meta.env.VITE_backend;

  useEffect(() => {
    teamgraph();
    teamprojectgraph();
    projectdomains();
    getdetails();
    fetchLimits();
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

  const fetchLimits = async () => {
    const res = await fetch(`${api}/api/admin/getlimits`);
    const data = await res.json();
    setSubmittedLimits(data);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    setShowConfirmation(false);
    console.log(limits);
    await fetch(`${api}/api/admin/updatelimits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(limits),
    });
    setShowForm(false);
    setFormSubmitted(true);
    setSubmittedLimits(limits); // Store the submitted limits
    localStorage.setItem('formSubmitted', 'true');
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  const renderDetailsTable = () => {
    if (!details) return null;

    const detailEntries = Object.entries(details).filter(
      ([key]) => key !== '__id' && key !== '__v'
    );

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

  const renderLimitsTable = () => {
    if (!submittedLimits) return null;

    const limitEntries = Object.entries(submittedLimits).filter(
      ([key]) => key !== '_id' && key !== '__v'
    );

    return (
      <table className="w-full border-collapse mt-5">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Limit</th>
            <th className="border px-4 py-2">Value</th>
          </tr>
        </thead>
        <tbody>
          {limitEntries.map(([key, value], index) => (
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
          {renderDetailsTable()}
          {renderLimitsTable()}
        </div>
      </div>
      <div className="flex-1 p-5">
        {!showForm && !formSubmitted && (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setShowForm(true)}
          >
            Fix Limits
          </button>
        )}
        {showForm && (
          <form onSubmit={handleFormSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="maxteamsize">
                Max Team Size
              </label>
              <input
                id="maxteamsize"
                type="number"
                value={limits.maxteamsize}
                onChange={(e) => setLimits({ ...limits, maxteamsize: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="minteamsize">
                Min Team Size
              </label>
              <input
                id="minteamsize"
                type="number"
                value={limits.minteamsize}
                onChange={(e) => setLimits({ ...limits, minteamsize: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="maxprofessorproject">
                Max Professor Project
              </label>
              <input
                id="maxprofessorproject"
                type="number"
                value={limits.maxprofessorproject}
                onChange={(e) => setLimits({ ...limits, maxprofessorproject: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="maxstudentapplications">
                Max Student Applications
              </label>
              <input
                id="maxstudentapplications"
                type="number"
                value={limits.maxstudentapplications}
                onChange={(e) => setLimits({ ...limits, maxstudentapplications: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Submit
            </button>
          </form>
        )}
      </div>
      <ConfirmationModal
        show={showConfirmation}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}
