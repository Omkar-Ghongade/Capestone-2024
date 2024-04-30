import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import Footer from './Footer';

export default function ProfessorProfiles() {
  const [professorData, setProfessorData] = useState(null);
  const [currentPage, setCurrentPage] = useState(0); // Current page of pagination
  const [profilesPerPage, setProfilesPerPage] = useState(4); // Number of profiles to display per page
  const [windowWidth, setWindowWidth] = useState(window.innerWidth); // Current viewport width
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const api = import.meta.env.VITE_backend;

  useEffect(() => {
    const fetchData = async () => {
      await fetchProfessorData();
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    updateProfilesPerPage();
  }, [windowWidth]);

  const fetchProfessorData = async () => {
    try {
      const res = await fetch(`${api}/api/professor/getprofessordata`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      setProfessorData(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const updateProfilesPerPage = () => {
    if (windowWidth < 640) {
      setProfilesPerPage(8); // For small screens, show 8 profiles per page
    } else if (windowWidth < 1024) {
      setProfilesPerPage(16); // For medium screens, show 16 profiles per page
    } else {
      setProfilesPerPage(32); // For large screens, show 32 profiles per page
    }
  };

  const indexOfLastProfile = (currentPage + 1) * profilesPerPage;
  const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;

  // Filter professor profiles based on search query
  const filteredProfiles = professorData
    ? professorData.filter(
        (professor) =>
          professor.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const currentProfiles = filteredProfiles.slice(
    indexOfFirstProfile,
    indexOfLastProfile
  );

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(0); // Reset to first page when search query changes
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <img
          src="https://srmap.edu.in/file/2019/12/Logo-2.png"
          alt="Loading..."
          style={{ width: "200px", height: "auto" }}
        />
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className='flex flex-col md:flex-row justify-between'>
      <div className="text-3xl mt-2 mb-2 mx-auto text-center josefin-sans">
        <h1>Professor Profiles</h1>
      </div>
      <div className="flex justify-center items-center mb-4 relative border border-gray-300 rounded-md">
        <input
          type="text"
          placeholder="Search Professors..."
          value={searchQuery}
          onChange={handleSearchInputChange}
          className="p-2 pr-8"
        />
        {(
          <button
            onClick={handleClearSearch}
            className="-translate-y-1 pt-1.5 bg-transparent border-none outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400 cursor-pointer"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M15.707 3.293a1 1 0 0 1 1.414 1.414L11.414 10l5.707 5.293a1 1 0 1 1-1.414 1.414L10 11.414l-5.293 5.707a1 1 0 0 1-1.414-1.414L8.586 10 3.293 4.707a1 1 0 0 1 1.414-1.414L10 8.586l5.707-5.293z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 px-4">
        {currentProfiles.map((professor, index) => (
          <div
            className="bg-white shadow-md hover:shadow-md hover:shadow-teal-200 transform hover:-translate-y-0.5 transition duration-200 ease-in-out rounded-md overflow-hidden"
            key={index}
          >
            <a
              href={professor.profilelink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={professor.profilephoto}
                alt={professor.name}
                className="max-w-360px max-h-200px w-full h-41 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">Name: {professor.name}</h3>
                <p className="text-gray-800 font-bold mt-2">Email: {professor.emailid}</p>
              </div>
            </a>
          </div>
        ))}
      </div>
      {professorData && (
        <div className="p-4">
          <ReactPaginate
            pageCount={Math.ceil(filteredProfiles.length / profilesPerPage)}
            onPageChange={handlePageChange}
            containerClassName="pagination"
            activeClassName="active"
            previousLabel="Previous"
            nextLabel="Next"
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
          />
        </div>
      )}
      <Footer />
    </div>
  );
}
